import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout.jsx";
import { API_BASE_URL } from "../utils/api.js";

const SignupDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    uniqueId: "",
    specialization: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/doctor-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response:", data, "Status:", res.status);

      if (res.ok) {
        alert(data.message);
        setFormData({ name: "", username: "", email: "", password: "", uniqueId: "", specialization: "" });
        navigate("/doctor-login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup frontend error:", err);
      alert("Signup failed. Check console for details.");
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
    <div className="doctor-signup-container">
  <div className="doctor-signup-card">
    <form className="doctor-signup-form" onSubmit={handleSubmit}>
      <h2 className="doctor-signup-title">Doctor Signup</h2>
      
      <div className="doctor-input-group">
        <input
          className="doctor-form-input"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="doctor-input-group">
        <input
          className="doctor-form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="doctor-input-group">
        <input
          className="doctor-form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="doctor-input-group">
        <input
          className="doctor-form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="doctor-input-group unique-id-input">
        <input
          className="doctor-form-input"
          type="text"
          name="uniqueId"
          placeholder="Unique ID"
          value={formData.uniqueId}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="doctor-input-group">
        <input
          className="doctor-form-input"
          type="text"
          name="specialization"
          placeholder="Specialization (e.g., Cardiologist, Dentist)"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
      </div>
      
      <button className="doctor-signup-button" type="submit">
        Sign Up
      </button>
    </form>
    
    <div className="doctor-login-link">
      Already have an account? <a href="/doctor-login">Login here</a>
    </div>
  </div>
</div>
    </Layout>
  );
};

export default SignupDoctor;
