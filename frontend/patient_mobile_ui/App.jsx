import React, { useEffect, useState } from "react";
import { getDoctors, registerPatient, bookAppointment } from "./api";

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    phone: "",
    symptoms: "",
    priority_score: 1,
  });
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
  });
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setMessage("");
        const data = await getDoctors();
        console.log("Doctors API response:", data);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Doctor fetch error:", err);
        setDoctors([]);
        setMessage(`Failed to load doctors: ${err.message}`);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  const handleRegisterPatient = async () => {
    try {
      setMessage("");

      const payload = {
        ...patient,
        age: Number(patient.age),
        priority_score: Number(patient.priority_score),
      };

      const data = await registerPatient(payload);
      setRegisteredPatient(data);
      setForm((prev) => ({
        ...prev,
        patient_id: String(data.patient_id),
      }));
      setMessage("Patient registered successfully");
    } catch (err) {
      setMessage(err.message || "Registration failed");
    }
  };

  const handleBookAppointment = async () => {
    try {
      setMessage("");

      if (!form.patient_id || !form.doctor_id) {
        setMessage("Please select patient and doctor");
        return;
      }

      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
      };

      const data = await bookAppointment(payload);
      setMessage(
        `Appointment booked. Token #${data.token_number}, predicted wait ${data.predicted_wait_time} min`
      );
    } catch (err) {
      setMessage(err.message || "Booking failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: 460,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        padding: 16,
        background: "#eff6ff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#2563EB" }}>Patient Booking Interface</h1>

      <section style={cardStyle}>
        <h2>Register Patient</h2>

        <Input
          placeholder="Name"
          value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
        />
        <Input
          placeholder="Age"
          value={patient.age}
          onChange={(e) => setPatient({ ...patient, age: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={patient.phone}
          onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
        />
        <Input
          placeholder="Symptoms"
          value={patient.symptoms}
          onChange={(e) => setPatient({ ...patient, symptoms: e.target.value })}
        />
        <Input
          placeholder="Priority Score (1-10)"
          value={patient.priority_score}
          onChange={(e) =>
            setPatient({ ...patient, priority_score: e.target.value })
          }
        />

        <button onClick={handleRegisterPatient} style={buttonStyle}>
          Register
        </button>

        {registeredPatient && (
          <p style={{ marginTop: 10 }}>
            Registered ID: {registeredPatient.patient_id}
          </p>
        )}
      </section>

      <section style={cardStyle}>
        <h2>Book Appointment</h2>

        <p>Doctors loaded: {loadingDoctors ? "Loading..." : doctors.length}</p>

        <select
          value={form.patient_id}
          onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select patient ID</option>
          {registeredPatient && (
            <option value={String(registeredPatient.patient_id)}>
              {registeredPatient.name} (ID {registeredPatient.patient_id})
            </option>
          )}
        </select>

        <select
          value={form.doctor_id}
          onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
          style={inputStyle}
        >
          <option value="">Choose doctor</option>
          {doctors.map((doc) => (
            <option key={doc.doctor_id} value={String(doc.doctor_id)}>
              {doc.name} - {doc.specialization}
            </option>
          ))}
        </select>

        <button onClick={handleBookAppointment} style={buttonStyle}>
          Book Appointment
        </button>
      </section>

      {message && (
        <div style={{ ...cardStyle, color: "#0f172a" }}>
          {message}
        </div>
      )}
    </div>
  );
}

function Input(props) {
  return <input {...props} style={inputStyle} />;
}

const cardStyle = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: 16,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  background: "#2563EB",
  color: "#fff",
  border: "none",
  padding: 12,
  borderRadius: 8,
  cursor: "pointer",
};