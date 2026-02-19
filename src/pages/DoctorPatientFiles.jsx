// frontend/src/pages/DoctorPatientFiles.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../components/Layout.jsx";
import { getApprovedPatientFiles, downloadDoctorFile, summarizeDoctorFile } from '../utils/api.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import "./../index.css"

class MarkdownRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error) {
    // If ReactMarkdown fails, fall back to sanitized HTML
    this.setState({ hasError: true });
  }
  render() {
    const { markdown } = this.props;
    if (this.state.hasError) {
      const html = DOMPurify.sanitize(marked.parse(markdown ?? '', { gfm: true, breaks: true }));
      return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return (
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    );
  }
}

export default function DoctorPatientFiles() {
  const { patientId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [summarizing, setSummarizing] = useState(null);
  const [summaries, setSummaries] = useState({}); // fileId -> summary text
  const [expandedSummaries, setExpandedSummaries] = useState({}); // fileId -> boolean
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        console.log('Fetching files for patient:', patientId);
        const data = await getApprovedPatientFiles(patientId);
        console.log('Files response:', data);
        if (!ignore) setFiles(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading files:', e);
        if (!ignore) setError(e.message || 'Failed to load files');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [patientId]);

  // After files update, try to scroll the first file into view (helps when layout pushes content)
  useEffect(() => {
    if (files && files.length > 0) {
      const el = document.getElementById(`file-${files[0]._id}`);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [files]);

  const toggleSummary = (fileId) => {
    setExpandedSummaries(prev => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  const copySummary = async (fileId, summary) => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedId(fileId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (loading) return <p className="doctor-files-loading">Loading files…</p>;
  if (error) return (
    <div className="doctor-files-container">
      <h2 className="doctor-files-title">Patient Files</h2>
      <p className="doctor-files-error">Error: {error}</p>
      <p style={{ textAlign: 'center', marginTop: '10px', color: '#6b7280' }}>
        Make sure you have approved access to this patient's files.
      </p>
    </div>
  );

  return (
    <Layout
      showAuth={false}
      rightSlot={
        <button onClick={() => navigate(-1)} className="nav-login-btn" style={{ background: '#6b7280' }}>
          Back
        </button>
      }
    >
      <div className="doctor-files-container">
        <h2 className="doctor-files-title">Patient Files</h2>
        {files.length === 0 && <p className="doctor-no-files">No files available for this patient.</p>}

        <ul className="doctor-files-list">
          {files.map(f => {
          console.log('Rendering file:', f);
          return (
          <li id={`file-${f._id}`} key={f._id} className="doctor-file-item">
            <div className="doctor-file-info">
              <div className="doctor-file-name">{f.originalName || 'Report'}</div>
              <div className="doctor-file-meta">
                {(f.size ? `${(f.size / (1024 * 1024)).toFixed(2)} MB` : '')} · {f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString() : 'Date not available'}
              </div>
            </div>
            <div className="doctor-file-actions">
              <button
                onClick={async () => {
                  setDownloading(f._id);
                  try {
                    await downloadDoctorFile(patientId, f._id, f.originalName);
                  } catch (e) {
                    if (e && (e.message === 'TOKEN_EXPIRED' || /jwt expired/i.test(e.message || ''))) {
                      try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch(ex) {}
                      alert('Session expired. You will be redirected to the home page.');
                      navigate('/');
                    } else {
                      alert(e.message || 'Download failed');
                    }
                  } finally {
                    setDownloading(null);
                  }
                }}
                disabled={downloading === f._id}
                className="doctor-download-btn"
              >
                {downloading === f._id ? (
                  <>
                    <span className="btn-spinner"></span>
                    Downloading…
                  </>
                ) : (
                  <>
                    <span className="btn-icon">⬇</span>
                    Download
                  </>
                )}
              </button>
              <button
                onClick={async () => {
                  setSummarizing(f._id);
                  try {
                    const res = await summarizeDoctorFile({ patientId, fileId: f._id, useGollie: false, schematic: true });
                    setSummaries(prev => ({ ...prev, [f._id]: res.summary }));
                    setExpandedSummaries(prev => ({ ...prev, [f._id]: true }));
                  } catch (e) {
                    if (e && (e.message === 'TOKEN_EXPIRED' || /jwt expired/i.test(e.message || ''))) {
                      try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch(ex) {}
                      alert('Session expired. Please login again. Redirecting to home.');
                      navigate('/');
                    } else {
                      alert(e.message || 'Summarization failed');
                    }
                  } finally {
                    setSummarizing(null);
                  }
                }}
                disabled={summarizing === f._id}
                className="doctor-summarize-btn"
              >
                {summarizing === f._id ? (
                  <>
                    <span className="btn-spinner"></span>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    Summarize
                  </>
                )}
              </button>
            </div>
            {summaries[f._id] && (
              <div className="doctor-file-summary">
                <div className="summary-header">
                  <button 
                    className="summary-toggle-btn"
                    onClick={() => toggleSummary(f._id)}
                  >
                    <span className="toggle-icon">{expandedSummaries[f._id] ? '▼' : '▶'}</span>
                    <span className="summary-title">AI Summary</span>
                  </button>
                  <button
                    className="summary-copy-btn"
                    onClick={() => copySummary(f._id, summaries[f._id])}
                    title="Copy to clipboard"
                  >
                    {copiedId === f._id ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                {expandedSummaries[f._id] && (
                  <div className="summary-content">
                    <div className="summary-text">
                      <MarkdownRenderer markdown={summaries[f._id]} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </li>
        );
          })}
        </ul>
      </div>
    </Layout>
  );
}
