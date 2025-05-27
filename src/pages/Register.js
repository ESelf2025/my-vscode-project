// src/pages/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./Firebase";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // "daughter" or "guardian"
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        role,
        createdAt: new Date(),
      });

      navigate("/"); // or wherever you want to send them
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#ffeaf4", minHeight: "100vh" }}>
      <h2>✨ Sign Up for DIARY</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: "10px" }}
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: "10px" }}
        />

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setRole("daughter")}
            style={{
              backgroundColor: role === "daughter" ? "#ffc6e0" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "0.5rem 1rem",
            }}
          >
            👧 I'm a Daughter
          </button>
          <button
            type="button"
            onClick={() => setRole("guardian")}
            style={{
              backgroundColor: role === "guardian" ? "#ffc6e0" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "0.5rem 1rem",
            }}
          >
            💖 I'm a Parent
          </button>
        </div>

        <button
          type="submit"
          disabled={!role}
          style={{
            backgroundColor: "#ff7fbf",
            color: "#fff",
            padding: "0.75rem",
            borderRadius: "10px",
            marginTop: "1rem",
            border: "none",
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;
