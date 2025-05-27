import React from "react";
import { useNavigate } from "react-router-dom";

const emotions = [
  "body image", "anxiety", "sadness", 
  "loneliness", "fear", "anger",
  "jealousy", "happiness", "shame", 
  "rejection"
];

export default function EmotionPicker() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: "#fbeaff",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "'Comic Sans MS', cursive"
    }}>
      <h2 style={{ textAlign: "center", color: "#d26cd4" }}>
        💭 How Are You Feeling?
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        maxWidth: "500px",
        margin: "40px auto"
      }}>
        {emotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => navigate(`/emotion/${emotion}`)}
            style={{
              backgroundColor: "#e4c4ff",
              border: "none",
              padding: "20px",
              fontSize: "16px",
              borderRadius: "12px",
              textTransform: "capitalize",
              cursor: "pointer"
            }}
          >
            {emotion}
          </button>
        ))}
      </div>
    </div>
  );
}
