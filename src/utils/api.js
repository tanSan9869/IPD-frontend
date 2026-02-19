// frontend/src/utils/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const BASE_URL = API_BASE_URL;

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check whether a JWT is expired (returns true if expired or invalid)
// Base64URL decoder (handles '-' and '_' and padding)
const b64UrlDecode = (str) => {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad) s += '='.repeat(4 - pad);
  return atob(s);
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const json = b64UrlDecode(parts[1]);
    const payload = JSON.parse(json);
    if (!payload || typeof payload.exp !== 'number') return true;
    // Allow small clock skew (5 seconds)
    const now = Math.floor(Date.now() / 1000) - 5;
    return payload.exp <= now;
  } catch (e) {
    return true;
  }
};

const http = async (path, { method = "GET", body, headers = {} } = {}) => {
  // If token is expired, clear storage and throw a specific error for the UI to handle
  const token = localStorage.getItem('token');
  if (isTokenExpired(token)) {
    try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch (e) {}
    throw new Error('TOKEN_EXPIRED');
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  const data = isJSON ? await res.json().catch(() => ({})) : null;
  if (!res.ok) throw new Error((data && data.message) || `HTTP ${res.status}`);
  return isJSON ? data : res;
};

// Doctors
export const getDoctors = () => http("/api/doctors");

// Requests (patient)
export const applyToDoctor = (doctorId) =>
  http("/api/requests", { method: "POST", body: { doctorId } });
export const getPatientRequests = () => http("/api/requests/patient");
export const revokeRequest = (id) => http(`/api/requests/${id}/revoke`, { method: "PATCH" });

// Requests (doctor)
export const getDoctorRequests = () => http("/api/requests/doctor");
export const updateRequestStatus = (id, status) =>
  http(`/api/requests/${id}`, { method: "PATCH", body: { status } });

// Files (doctor, approved access only)
export const getApprovedPatientFiles = (patientId) =>
  http(`/api/files/doctor/patient/${patientId}`);

export const downloadDoctorFile = async (patientId, fileId, filename) => {
  const token = localStorage.getItem('token');
  if (isTokenExpired(token)) {
    try { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('id'); } catch (e) {}
    throw new Error('TOKEN_EXPIRED');
  }

  const res = await fetch(
    `${BASE_URL}/api/files/doctor/patient/${patientId}/file/${fileId}`,
    {
      headers: { ...authHeaders() },
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "report";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Summarization APIs
export const summarizeText = ({ text, useGollie = false, schematic = false }) =>
  http(`/api/summarize/text`, {
    method: "POST",
    body: { text, useGollie, schematic },
  });

export const summarizeDoctorFile = ({ patientId, fileId, useGollie = false, schematic = false }) =>
  http(`/api/summarize/doctor/patient/${patientId}/file/${fileId}`, {
    method: "POST",
    body: { useGollie, schematic },
  });
