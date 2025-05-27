// src/pages/GuardianCommunity.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GuardianCommunity() {
  const navigate = useNavigate();
  const [zipcode, setZipcode] = useState("");

  const containerStyle = {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(to bottom right, #fffaf3, #f3f3ec)",
    color: "#4b2e2e",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    flex: 1,
    margin: "12px",
    textAlign: "center",
    color: "#2f3e2e",
  };

  const sectionStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "24px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginTop: "12px",
    width: "80%",
    fontSize: "16px",
  };

  const buttonStyle = {
    marginTop: "16px",
    padding: "10px 20px",
    backgroundColor: "#6ca27c",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", fontSize: "36px", color: "#3c2f2f" }}>
        Join a Group
      </h1>

      <div style={sectionStyle}>
        <div style={cardStyle}>
          <h2>Search by Daughter's Age</h2>
          <p>Ages 10–14</p>
          <button
            style={buttonStyle}
            onClick={() => navigate("/guardian-group-age")}
          >
            Join Group Chat
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Search Moms in Area</h2>
          <input
            type="text"
            placeholder="Enter your zip code"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            style={inputStyle}
          />
          <button
            style={buttonStyle}
            onClick={() => navigate(`/guardian-group-zip/${zipcode}`)}
          >
            Join Local Chat
          </button>
        </div>
      </div>

      <div style={{ marginTop: "60px", textAlign: "center" }}>
        <h2>Private Messages</h2>
        <button
          style={buttonStyle}
          onClick={() => navigate("/guardian-dms")}
        >
          Go to DM Inbox
        </button>
      </div>
    </div>
  );
}

export default GuardianCommunity;
