const API_BASE = "http://127.0.0.1:8000/api";

export async function getDoctors() {
  const res = await fetch(`${API_BASE}/doctors`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch doctors");
  return data;
}

export async function getDoctorSchedule(doctorId) {
  const res = await fetch(`${API_BASE}/doctors/${doctorId}/schedule`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch doctor schedule");
  return data;
}

export async function registerPatient(payload) {
  const res = await fetch(`${API_BASE}/patients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
}

export async function bookAppointment(payload) {
  const res = await fetch(`${API_BASE}/patients/appointments/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Booking failed");
  return data;
}

export async function getQueueStatus(patientId) {
  const res = await fetch(`${API_BASE}/patients/${patientId}/queue-status`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch queue status");
  return data;
}

export async function getAnalyticsDashboard() {
  const res = await fetch(`${API_BASE}/admin/analytics/dashboard`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch analytics");
  return data;
}