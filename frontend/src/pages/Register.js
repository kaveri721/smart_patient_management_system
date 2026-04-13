import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const registerUser = async () => {
    try {
      await API.post("/register", form);

      alert("Registration successful ✅");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>📝 Register New User</h2>

        <input
          name="name"
          placeholder="Full Name"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          style={styles.input}
          onChange={handleChange}
        />

        <select
          name="role"
          style={styles.input}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
          <option value="receptionist">Receptionist</option>
        </select>

        <button style={styles.button} onClick={registerUser}>
          Register
        </button>

        <p
          style={{ marginTop: "10px", cursor: "pointer", color: "#2563eb" }}
          onClick={() => navigate("/")}
        >
          Already have account? Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(to right, #60a5fa, #3b82f6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.15)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
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
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Register;