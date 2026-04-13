import React, { useEffect, useState } from "react";
import API from "../api";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    try {
      const res = await API.get("/doctor/appointments/today");

      // ensure response is always array
      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else if (res.data.appointments) {
        setAppointments(res.data.appointments);
      } else {
        setAppointments([]);
      }

    } catch (error) {
      console.error(error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>👨‍⚕️ Doctor Dashboard</h2>

      {appointments.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No appointments scheduled today
        </p>
      ) : (
        <div style={styles.cardContainer}>
          {appointments.map((a, index) => (
            <div key={index} style={styles.card}>
              <h4>Patient ID: {a.patient_id}</h4>
              <p>Status: {a.status}</p>
              <p>Token: {a.token_number}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f1f5f9",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
  }
};

export default DoctorDashboard;