import React, { useState } from "react";
import API from "../api";

function PatientDashboard() {
  const [doctorId, setDoctorId] = useState("");
  const [severity, setSeverity] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);

  const bookAppointment = async () => {
    try {
      const res = await API.post(
        `/appointments/book?doctor_id=${doctorId}&severity=${severity}&age=${age}`
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🏥 Patient Appointment Predictor</h2>

        <input
          style={styles.input}
          placeholder="Doctor ID"
          onChange={(e) => setDoctorId(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Symptom Severity (1–10)"
          onChange={(e) => setSeverity(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <button style={styles.button} onClick={bookAppointment}>
          Predict Waiting Time
        </button>

        {result && (
          <div style={styles.resultBox}>
            <h3>📊 Prediction Result</h3>
            <p>Priority Score: {result.priority_score}</p>
            <p>Estimated Wait Time: {result.predicted_wait_time} minutes</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(to right, #dbeafe, #eff6ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center"
  },

  heading: {
    marginBottom: "20px",
    color: "#1e3a8a"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px"
  },

  resultBox: {
    marginTop: "20px",
    background: "#f1f5f9",
    padding: "15px",
    borderRadius: "8px"
  }
};

export default PatientDashboard;