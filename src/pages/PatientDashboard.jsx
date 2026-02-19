import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import StatBar from "../components/ui/StatBar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const PatientDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploadProgress, setUploadProgress] = useState(0);


  // Memoized fetch function to prevent unnecessary re-creation
  const fetchFiles = useCallback(async () => {
    if (!id) {
      setError("Patient ID not found in URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
  const response = await fetch(`http://localhost:5000/api/files/patient/${id}/files`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Backend may not be running.");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.files)) {
        setFiles(data.files);
      } else {
        setFiles([]);
        setError(data.message || "No files available for this patient.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch files. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  

  // Memoized file change handler
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "No file selected");
  }, []);

  // Memoized upload handler
  const handleUpload = useCallback(async () => {
    if (!selectedFile || !id) return alert("Select a file and ensure patient ID exists.");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `http://localhost:5000/api/files/patient/${id}/upload`);

      // Upload progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          alert("File encrypted & uploaded successfully!");
          setSelectedFile(null);
          setFileName("No file selected");
          setUploadProgress(0);
          fetchFiles();
        } else {
          alert("Upload failed!");
          setUploadProgress(0);
        }
      };

      xhr.send(formData);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
      setUploadProgress(0);
    }
  }, [selectedFile, id, fetchFiles]);

  // Memoized delete handler
  const handleDelete = useCallback(async (fileId) => {
    try {
      // Optimistic update
      setFiles(prevFiles => prevFiles.filter(f => f._id !== fileId));

      const res = await fetch(
        `http://localhost:5000/api/files/patient/${id}/file/${fileId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.success) {
        alert("Delete failed: " + data.message);
        fetchFiles(); // Revert optimistic update
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed!");
      fetchFiles(); // Revert optimistic update
    }
  }, [id, fetchFiles]);
  
  // Memoized download handlers
  const downloadEncrypted = useCallback((fileId) => {
  window.location = `http://localhost:5000/api/files/patient/${id}/download-encrypted/${fileId}`;
  }, [id]);

  const decryptAndDownload = useCallback((fileId) => {
  window.location = `http://localhost:5000/api/files/patient/${id}/download-decrypted/${fileId}`;
  }, [id]);

  // Memoized navigation handlers
  const navigateToDoctors = useCallback(() => {
    navigate('/doctors-list');
  }, [navigate]);

  const navigateToRequests = useCallback(() => {
    navigate('/my-requests');
  }, [navigate]);

  // Logout handler: clear auth and redirect to home
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
    } catch (e) {
      // ignore
    }
    navigate('/');
  }, [navigate]);

  // Memoized files list to prevent unnecessary re-renders
  const filesList = useMemo(() => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading files...</p>
        </div>
      );
    }
    
    if (error) {
      return <div className="error-message"><p>Error: {error}</p></div>;
    }
    
    if (files.length === 0) {
      return (
        <EmptyState
          title="No files uploaded yet"
          description="Upload your medical records to manage and share securely."
          actionLabel="Upload a file"
          onAction={() => document.getElementById('file-upload')?.click()}
        />
      );
    }
    
    return (
      <div className="files-container">
        {files.map((file) => (
          <div key={file._id} className="file-item">
            <div className="file-info">
              <span className="file-name">{file.originalName || file.name}</span>
              {typeof file.size === "number" && (
                <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
              )}
            </div>
            <div className="file-actions">
              <button onClick={() => decryptAndDownload(file._id)} className="file-view-button">Download</button>
              <button onClick={() => handleDelete(file._id)} className="file-delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [files, loading, error, decryptAndDownload, downloadEncrypted, handleDelete]);

  // Memoized upload progress display
  const uploadProgressDisplay = useMemo(() => {
    if (uploadProgress > 0) {
      return (
        <div className="upload-progress">
          <progress value={uploadProgress} max="100"></progress>
          <span>{uploadProgress}%</span>
        </div>
      );
    }
    return null;
  }, [uploadProgress]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <Layout
      showAuth={false}
      rightSlot={
        <button
          onClick={handleLogout}
          className="nav-login-btn"
          style={{ background: '#e74c3c' }}
        >
          Logout
        </button>
      }
    >
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Patient Dashboard</h2>
            <p className="dashboard-subtitle">Manage your medical documents</p>
            <div className="dashboard-actions">
              <button onClick={navigateToDoctors} className="find-doctors-button">Find Doctors</button>
              <button 
                onClick={navigateToRequests} 
                className="find-doctors-button"
                style={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)' }}
              >
                My Requests
              </button>
            </div>
          </div>
          <StatBar
            items={[
              { label: 'Files', value: files.length, icon: '📄' },
              { label: 'Upload Progress', value: `${uploadProgress}%`, icon: '⬆️' },
            ]}
          />

          <div className="upload-section">
            <h3 className="section-title">Upload Medical Records</h3>
            <div className="file-upload-container">
              <div className="file-input-group">
                <label htmlFor="file-upload" className="file-upload-label">Choose File</label>
                <input type="file" id="file-upload" onChange={handleFileChange} className="file-upload-input" />
                <span className="selected-file-name">{fileName}</span>
              </div>
              <button onClick={handleUpload} className="upload-button" disabled={!selectedFile}>
                Encrypt & Upload
              </button>
              {uploadProgressDisplay}
            </div>
          </div>

          <div className="files-section">
            <h3 className="section-title">Your Medical Documents</h3>
            <div className="files-content">{filesList}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
