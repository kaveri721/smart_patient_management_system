import React, { useState } from "react";
import API from "../api";

function ReceptionistDashboard() {
  const [doctorId, setDoctorId] = useState("");

  const createWalkin = async () => {
    try {
      await API.post(`/walkin/register?doctor_id=${doctorId}`);
      alert("Walk-in patient added ✅");
    } catch {
      alert("Failed to add patient ❌");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🧑‍💼 Receptionist Panel</h2>

        <input
          style={styles.input}
          placeholder="Doctor ID"
          onChange={(e) => setDoctorId(e.target.value)}
        />

        <button style={styles.button} onClick={createWalkin}>
          Register Walk-in Patient
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#e0f2fe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 8px 18px rgba(0,0,0,0.12)",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "12px 20px",
    background: "#0ea5e9",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default ReceptionistDashboard;