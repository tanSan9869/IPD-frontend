import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Layout from "./Layout.jsx";

const SignupPatient = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading to true when signup starts

    if (!name || !email || !username || !password || password !== confirmPassword) {
      setError("All fields are required & passwords must match!");
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/patient-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : { message: "Signup failed" }; // Handle potential parsing errors
        throw new Error(data.message || "Signup failed");
      }

      const data = await response.json(); // Use response.json() for proper JSON parsing.
      alert(data.message);
      navigate("/patient-login");
    } catch (error) {
      setError(error.message || "Server error, please try again.");
    } finally {
      setLoading(false); // Set loading to false when signup finishes (success or error)
    }
  };

  return ( 
    <Layout
      showAuth={false}
      rightSlot={
        <button onClick={() => navigate('/role-selection')} className="nav-login-btn" style={{ background: '#6b7280' }}>
          Back
        </button>
      }
    >
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Patient Signup</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignup} className="signup-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`signup-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>
          <p className="login-link">
            Already have an account? <a href="/patient-login">Login</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPatient;