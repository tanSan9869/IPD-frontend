// frontend/src/pages/DoctorsList.jsx
import { useEffect, useState } from "react";
import { getDoctors, applyToDoctor } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getDoctors();
        // Normalize to array (supports { doctors: [...] } or non-array responses)
        const normalized =
          Array.isArray(data) ? data : (Array.isArray(data?.doctors) ? data.doctors : []);
        if (!ignore) setDoctors(normalized);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load doctors");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const handleApply = async (doctorId) => {
    setSubmitting(doctorId);
    setError("");
    try {
      await applyToDoctor(doctorId);
      alert("Applied successfully");
      // navigate("/my-requests");
    } catch (e) {
      if (e && e.message === 'TOKEN_EXPIRED') {
        try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch (err) {}
        setError('Session expired. Please login again.');
        navigate('/patient-login', { replace: true });
      } else {
        setError(e.message || "Failed to apply");
      }
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <p style={{ padding: 16 }}>Loading doctors…</p>;
  if (error) return <p style={{ padding: 16, color: "crimson" }}>{error}</p>;

  // Guard rendering: always use an array
  const list = Array.isArray(doctors) ? doctors : [];

  return (
    <Layout
      showAuth={false}
      rightSlot={
        <button onClick={() => navigate(-1)} className="nav-login-btn" style={{ background: '#6b7280' }}>
          Back
        </button>
      }
    >
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Find Doctors</h2>
            <p className="dashboard-subtitle">Choose a specialist for consultation</p>
          </div>

          <div className="doctors-section">
            {list.length === 0 && <p>No doctors found.</p>}
            <div className="doctors-grid">
              {list.map((d) => (
                <div key={d._id} className="doctor-card">
                  <div className="doctor-info">
                    <div className="doctor-name">{d.name}</div>
                    <div className="doctor-specialization">{d.specialization}</div>
                    <div className="doctor-badge">
                      {d.specialization?.toLowerCase().includes('cardio') && '❤️'}
                      {d.specialization?.toLowerCase().includes('dentist') && '🦷'}
                      {d.specialization?.toLowerCase().includes('surgeon') && '🔪'}
                      {d.specialization?.toLowerCase().includes('orthopedic') && '🦴'}
                      {(!d.specialization?.toLowerCase().includes('cardio') && 
                        !d.specialization?.toLowerCase().includes('dentist') && 
                        !d.specialization?.toLowerCase().includes('surgeon') && 
                        !d.specialization?.toLowerCase().includes('orthopedic')) && '👨‍⚕️'}
                    </div>
                  </div>
                  <button
                    disabled={submitting === d._id}
                    onClick={() => handleApply(d._id)}
                    className="consult-button"
                    style={{ opacity: submitting === d._id ? 0.7 : 1 }}
                  >
                    {submitting === d._id ? "Applying..." : "Consult"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
