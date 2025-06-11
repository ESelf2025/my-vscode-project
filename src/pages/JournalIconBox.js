import React from "react";

function JournalIconBox({ toggleMode }) {
  return (
    <div
      className="journal-icon"
      onClick={toggleMode}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px auto",
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        boxShadow: "0 4px 8px rgba(255, 182, 193, 0.5), 0 8px 16px rgba(173, 216, 230, 0.5)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(255, 182, 193, 0.7), 0 12px 24px rgba(173, 216, 230, 0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(255, 182, 193, 0.5), 0 8px 16px rgba(173, 216, 230, 0.5)";
      }}
    >
      <img
        src="/assets/friends-icon.png"
        alt="Journal Icon"
        className="journal-icon-image"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

export default JournalIconBox;