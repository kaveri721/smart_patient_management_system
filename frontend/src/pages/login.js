import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });

      const token = res.data.access_token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "doctor") navigate("/doctor");
      else if (role === "admin") navigate("/admin");
      else if (role === "receptionist") navigate("/receptionist");
      else navigate("/patient");

    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏥 Smart Patient Queue System</h2>

        <input
          style={styles.input}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
          <p
            style={{ marginTop: "10px", cursor: "pointer", color: "#2563eb" }}
            onClick={() => navigate("/register")}
            >
            New user? Register here
        </p>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #3b82f6, #60a5fa)"
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
    textAlign: "center"
  },
  title: {
    marginBottom: "25px",
    color: "#1e3a8a"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Login;