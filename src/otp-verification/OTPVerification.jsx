import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../utils/api.js";

const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Send OTP
  const handleSendOTP = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Debug: log raw response for easier troubleshooting if server returns HTML
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response from /api/otp/send:", text);
        throw new Error("Unexpected server response. Check server logs.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      
      setMessage(data.message);
      if (data.success) {
        setOtpSent(true);
        setTimer(60);
        setResendDisabled(true);
      }
    } catch (err) {
      setError(err.message || "Error sending OTP");
    }
  };
  
  // Verify OTP
  const handleVerify = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response from /api/otp/verify:", text);
        throw new Error("Unexpected server response. Check server logs.");
      }
      
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
      
      setMessage(data.message);
      
      const patientId = searchParams.get("patientId");
      if (patientId) {
        if (!patientId) {
          throw new Error("Patient ID missing from server response");
        }
        navigate(`/patient-dashboard/${patientId}`);
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    await handleSendOTP();
    setTimer(60);
    setResendDisabled(true);
  };

  // Countdown timer
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  return (
    <>
      <nav className="navbar">
        <div className="logo-container">
          <img src="/smartcare-logo.png" alt="SmartCare Logo" className="logo" />
          <span className="logo-text">SmartCare</span>
        </div>
      </nav>

      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Verify OTP</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p>{message}</p>}

          {!otpSent ? (
            <div className="email-input-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="email-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="email-input-button" onClick={handleSendOTP}>
                Send OTP
              </button>
            </div>
          ) : (
            <div className="otp-input-form">
              <p>An OTP has been sent to {email}.</p>
              <input
                type="text"
                placeholder="Enter OTP"
                className="otp-input-field"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
              <button className="otp-input-button" onClick={handleVerify}>
                Verify
              </button>
              <div className="timer-container">
                {timer > 0 ? (
                  <p className="timer-message">Resend OTP in {timer} seconds.</p>
                ) : (
                  <button
                    className="timer-resend"
                    onClick={handleResend}
                    disabled={resendDisabled}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
