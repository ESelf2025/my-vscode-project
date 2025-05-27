// src/pages/GuardianDashboard.js
import React from "react";
import { auth } from "./Firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";

function GuardianDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: "linear-gradient(to right, #b39ddb, #ce93d8, #f48fb1)", // dusty lilac / orchid tones
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    color: "#fff",
  };

  const buttonStyle = {
    backgroundColor: "#f06292", // bold rosy color
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f3e5f5, #fce4ec)",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
  };

  return (
    <div style={containerStyle}>
     <nav
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    background: "linear-gradient(90deg, #c8b6ff, #f3c6ff, #b9fbc0)",
    padding: "12px 24px",
    borderRadius: "32px",
    boxShadow: "0 6px 16px rgba(186, 104, 200, 0.3)",
    marginBottom: "40px",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  {[
    { path: "/guardian-community", label: "Community" },
    { path: "/guardian-guide", label: "Guide" },
    { path: "/guardian-help", label: "Help" },
    { path: "/bible", label: "Bible" },
    { path: "/profile", label: "Profile" },
  ].map(({ path, label }) => (
    <Link
      key={path}
      to={path}
      style={{
        padding: "10px 18px",
        borderRadius: "20px",
        backgroundColor: location.pathname === path ? "#ffffffaa" : "transparent",
        boxShadow:
          location.pathname === path
            ? "0 0 10px rgba(255, 255, 255, 0.6), inset 0 0 5px #fff"
            : "none",
        color: "#4a148c",
        fontWeight: "bold",
        fontSize: "16px",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
    >
      {label}
    </Link>
  ))}
</nav>


      <main style={{ marginTop: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", color: "#6a1b9a" }}>Welcome, Guardian!</h1>
        <p style={{ fontSize: "18px", color: "#4a148c" }}>
          This page is just for parents and guardians to support their daughter's journey.
        </p>
      </main>
    </div>
  );
}

export default GuardianDashboard;
