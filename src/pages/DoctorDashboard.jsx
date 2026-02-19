// frontend/src/pages/DoctorDashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { getDoctorRequests, updateRequestStatus } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import StatBar from "../components/ui/StatBar.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

export default function DoctorDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper function to get patient initials for avatar
  const getInitials = (name) => {
    if (!name) return "P";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getDoctorRequests();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getDoctorRequests();
        if (!ignore) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e && e.message === 'TOKEN_EXPIRED') {
          try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch (err) {}
          if (!ignore) {
            setError('Session expired. Please login again.');
            navigate('/doctor-login', { replace: true });
          }
        } else {
          if (!ignore) setError(e.message || "Failed to load requests");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const act = async (id, status) => {
    setActing(id);
    setError("");
    try {
      await updateRequestStatus(id, status);
      await load();
    } catch (e) {
      if (e && e.message === 'TOKEN_EXPIRED') {
        try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch (err) {}
        setError('Session expired. Please login again.');
        navigate('/doctor-login', { replace: true });
      } else {
        setError(e.message || "Failed to update");
      }
    } finally {
      setActing(null);
    }
  };

  const totalPending = rows.filter(r => r.status === "pending").length;
  const totalApproved = rows.filter(r => r.status === "approved").length;
  const totalRequests = rows.length;

  if (loading) return <p className="loading-text">Loading requests…</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <Layout
      showAuth={false}
      rightSlot={
        <button
          onClick={() => { try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch(e) {} navigate('/'); }}
          className="nav-login-btn"
          style={{ background: '#e74c3c' }}
        >
          Logout
        </button>
      }
    >
      <div className="doctor-dashboard">
        <div className="doctor-dashboard-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h2 className="doctor-dashboard-title">Requests</h2>
        </div>
        <StatBar items={[
          { label: 'Pending', value: totalPending, icon: '⏳' },
          { label: 'Approved', value: totalApproved, icon: '✅' },
          { label: 'Total', value: totalRequests, icon: '📬' },
        ]} />
      <div className="pending-count-container">
        <p className="pending-count-text">
          You have <strong>{totalPending}</strong> pending request{totalPending !== 1 ? 's' : ''}.
        </p>
      </div>

      {rows.length === 0 && <p className="no-requests-text">No requests yet.</p>}

      <ul className="requests-list">
        {rows.map((r) => {
          const patient = r.patientId || {};
          const status = r.status;
          const initials = getInitials(patient.name);

          return (
            <li key={r._id} className="request-item">
              <div className="patient-section">
                <div className="patient-avatar">{initials}</div>
                <div className="patient-info">
                  <div className="patient-name">{patient.name || "Patient"}</div>
                  <div className="patient-email">{patient.email || "-"}</div>
                </div>
              </div>

              <div className="request-actions">
                <StatusBadge status={status} />

                {status === "pending" && (
                  <>
                    <button
                      onClick={() => act(r._id, "approved")}
                      disabled={acting === r._id}
                      className="approve-button"
                    >
                      {acting === r._id ? (
                        <>
                          <span className="button-spinner"></span>
                          Saving…
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">✓</span>
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => act(r._id, "rejected")}
                      disabled={acting === r._id}
                      className="reject-button"
                    >
                      {acting === r._id ? (
                        <>
                          <span className="button-spinner"></span>
                          Saving…
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">✗</span>
                          Decline
                        </>
                      )}
                    </button>
                  </>
                )}

                {status === "approved" && patient._id && (
                  <button
                    onClick={() => navigate(`/doctor/patient/${patient._id}/files`)}
                    className="view-files-button"
                  >
                   
                    View Files
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      </div>
    </Layout>
  );
}
