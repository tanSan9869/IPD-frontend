// frontend/src/pages/PatientRequests.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientRequests, revokeRequest } from "../utils/api.js";
import Layout from "../components/Layout.jsx";

export default function PatientRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getPatientRequests();
        if (!ignore) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load requests");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const onRevoke = async (id) => {
    setError("");
    try {
      await revokeRequest(id);
      // Reload list
      const data = await getPatientRequests();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to revoke");
    }
  };

  if (loading) return <p style={{ padding: 16 }}>Loading requests…</p>;
  if (error) return <p style={{ padding: 16, color: "crimson" }}>{error}</p>;

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
            <h2 className="dashboard-title">My Consultation Requests</h2>
            <p className="dashboard-subtitle">Track your consultation applications</p>
          </div>

          <div className="requests-section">
            {rows.length === 0 && (
              <div className="no-requests">
                <p>No requests yet. Go to "Find Doctors" to apply.</p>
                <button 
                  onClick={() => window.location.href = '/doctors-list'} 
                  className="find-doctors-button"
                  style={{ marginTop: '10px' }}
                >
                  Find Doctors
                </button>
              </div>
            )}

            <div className="requests-list">
              {rows.map((r) => {
                const status = r.status;
                const doctorName = r?.doctorId?.name || "Doctor";
                const specialization = r?.doctorId?.specialization || "-";

                const chipStyle = {
                  pending: { background: "#fef3c7", color: "#92400e", border: "1px solid #f59e0b" },
                  approved: { background: "#dcfce7", color: "#166534", border: "1px solid #10b981" },
                  rejected: { background: "#fee2e2", color: "#991b1b", border: "1px solid #ef4444" },
                  cancelled: { background: "#e5e7eb", color: "#374151", border: "1px solid #6b7280" },
                }[status] || { background: "#e5e7eb", color: "#374151", border: "1px solid #6b7280" };

                return (
                  <div key={r._id} className="request-card">
                    <div className="request-info">
                      <div className="doctor-name">{doctorName}</div>
                      <div className="doctor-specialization">{specialization}</div>
                      <div className="request-date">
                        Applied: {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="request-status">
                      <span
                        className="status-badge"
                        style={{
                          ...chipStyle,
                          padding: "8px 16px",
                          borderRadius: "20px",
                          textTransform: "capitalize",
                          fontWeight: 600,
                          fontSize: 14,
                          minWidth: 100,
                          textAlign: "center",
                        }}
                        title={`Status: ${status}`}
                      >
                        {status}
                      </span>
                      {(status === 'pending' || status === 'approved') && (
                        <button
                          onClick={() => onRevoke(r._id)}
                          className="revoke-button"
                          style={{
                            marginLeft: 12,
                            background: '#6b7280',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            width: 100
                          }}
                          title="Revoke this request"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {rows.length > 0 && (
              <div className="info-tip">
                <p>
                  💡 <strong>Tip:</strong> If a doctor approves your request, they will be able to view your encrypted medical reports.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
