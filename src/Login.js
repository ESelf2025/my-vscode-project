// src/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./pages/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === "guardian") {
          navigate("/guardian-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert("User document not found.");
      }
    } catch (error) {
      alert("Error signing in: " + error.message);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>💖 Login to DIARY</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            marginTop: "16px",
            backgroundColor: "#ff69b4",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
