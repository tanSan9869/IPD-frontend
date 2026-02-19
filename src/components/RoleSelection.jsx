import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure this import is present
import Layout from "./Layout.jsx";
const smartcareLogo = "/smartcare-logo.png";
const RoleSelection = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSelection = () => {
    if (role === "patient") {
      navigate("/patient-signup");
    } else if (role === "doctor") {
      navigate("/doctor-signup");
    }
  };

    return (
        <Layout
            showAuth={false}
            rightSlot={
                <button onClick={() => navigate('/')} className="nav-login-btn" style={{ background: '#6b7280' }}>
                    Home
                </button>
            }
        >
                        <div className="role-selection-container">
                <div className="main-content">
                    <div className="role-card">
                        <h2 className="role-title">Choose Your Role</h2>
                        <p className="role-subtitle">Select how you want to use SmartCare</p>
                        <div className="role-options">
                            <div
                                className={`role-option ${role === "patient" ? "selected" : ""}`}
                                onClick={() => setRole("patient")}
                            >
                                <img src="/patient-logo.png" alt="Patient Logo" className="role-icon" />
                                <span>Patient</span>
                                <p className="role-description">Find doctors and book appointments</p>
                            </div>
                            <div
                                className={`role-option ${role === "doctor" ? "selected" : ""}`}
                                onClick={() => setRole("doctor")}
                            >
                                <img src="/doctor-logo.png" alt="Doctor Logo" className="role-icon" />
                                <span>Doctor</span>
                                <p className="role-description">Manage your practice and patients</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSelection}
                            disabled={!role}
                            className="continue-button"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
    </Layout>
    );
};

export default RoleSelection;
