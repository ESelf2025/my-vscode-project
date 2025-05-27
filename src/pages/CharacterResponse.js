// src/pages/CharacterResponse.js
import React from "react";

function CharacterResponse({ character }) {
  if (!character) return null;

  return (
    <div style={{ backgroundColor: "#ffe6f0", padding: "30px", marginTop: "30px", borderRadius: "16px" }}>
      <h3 style={{ color: "#cc66cc" }}>🎥 {character.name} wants to encourage you!</h3>
      
      {/* VIDEO */}
      <video width="100%" height="240" controls style={{ marginBottom: "20px", borderRadius: "10px" }}>
        <source src={character.videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* STORY */}
      <p><strong>📖 Bible Story:</strong> {character.story}</p>

      {/* VERSE */}
      <p><strong>📖 Verse:</strong> {character.verse}</p>

      {/* DECLARATION */}
      <p><strong>🪞 Declaration:</strong> {character.declaration}</p>

      {/* PRAYER */}
      <p><strong>🙏 Prayer:</strong> {character.prayer}</p>
    </div>
  );
}

export default CharacterResponse;
