import React from "react";
import { useParams } from "react-router-dom";

const content = {
  anxiety: {
    videoUrl: "https://www.youtube.com/embed/your-video-link-here",
    verse: "Philippians 4:6",
    story: "Jesus calmed the storm (Mark 4:35–41)",
    prayer: "Jesus, calm my anxious heart and help me trust You.",
    declaration: "I am not alone. Jesus is with me and gives me peace."
  },
  sadness: {
    videoUrl: "https://www.youtube.com/embed/your-video-link-here",
    verse: "Psalm 34:18",
    story: "Jesus wept with Mary and Martha (John 11)",
    prayer: "God, be near to me. Help me feel Your comfort.",
    declaration: "Even when I cry, God is close to me."
  },
  // Add more emotions and stories here
};

export default function EmotionPage() {
  const { emotion } = useParams();
  const data = content[emotion.toLowerCase()];

  if (!data) return <h2>Emotion not found</h2>;

  return (
    <div style={{
      backgroundColor: "#ffe6f0",
      padding: "30px",
      minHeight: "100vh",
      fontFamily: "'Comic Sans MS', cursive"
    }}>
      <h2 style={{ color: "#d26cd4", textAlign: "center" }}>
        🎬 A Talk About {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
      </h2>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <iframe
          width="300"
          height="170"
          src={data.videoUrl}
          title="Devotional Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      <div style={{
        backgroundColor: "#f7c6ff",
        padding: "20px",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <p><strong>📖 Bible Verse:</strong> {data.verse}</p>
        <p><strong>📚 Bible Story:</strong> {data.story}</p>
        <p><strong>🙏 What to Pray:</strong> {data.prayer}</p>
        <p><strong>💬 Say Out Loud:</strong> {data.declaration}</p>
      </div>
    </div>
  );
}
