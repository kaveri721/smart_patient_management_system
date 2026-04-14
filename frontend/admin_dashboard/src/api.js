const API_BASE = "http://127.0.0.1:8000/api";

export async function getDoctors() {
  const res = await fetch(`${API_BASE}/doctors/`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function getDoctorSchedule(doctorId) {
  const res = await fetch(`${API_BASE}/doctors/${doctorId}/schedule`);
  if (!res.ok) throw new Error("Failed to fetch doctor schedule");
  return res.json();
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
  if (!res.ok) throw new Error("Failed to fetch queue status");
  return res.json();
}

export async function getAnalyticsDashboard() {
  const res = await fetch(`${API_BASE}/admin/analytics/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}
export const getDoctorSchedule = async () => {
  const res = await fetch("http://127.0.0.1:8000/doctor/schedule");
  return res.json();
};