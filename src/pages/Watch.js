import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";
import { useNavigate } from "react-router-dom";

const currentUserId = "EDENSELFF";

const biblePlans = [
  { id: 1, title: "Can’t Stop Smiling", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  // Add more plans here if needed
];

const postJoinedPlan = (plan) =>
  addDoc(collection(db, "joinedPlans"), {
    userId: currentUserId,
    planTitle: plan.title,
    duration: plan.duration,
    imageUrl: plan.imageUrl,
    joinedAt: serverTimestamp(),
  });

function Watch() {
  const [pinnedPlan, setPinnedPlan] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPinnedPlan() {
      const q = query(
        collection(db, "joinedPlans"),
        where("userId", "==", currentUserId),
        orderBy("joinedAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setPinnedPlan(snapshot.docs[0].data());
      }
    }

    fetchPinnedPlan();
  }, []);

  const moods = ["😔", "😊", "😡", "🥹"];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "radial-gradient(circle at 20% 30%, #ffe4f1, transparent 70%), radial-gradient(circle at 80% 70%, #f7d9ff, transparent 70%), linear-gradient(135deg, #ffeaf4, #f3e0ff)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        {moods.map((emoji, i) => (
          <button
            key={i}
            onClick={() => setSelectedMood(emoji)}
            style={{
              fontSize: "20px",
              backgroundColor: selectedMood === emoji ? "#ffe6fa" : "white",
              border: "2px solid #ff99cc",
              borderRadius: "12px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Video Section */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p style={{ color: "#cc66cc", fontWeight: "600" }}>
          Intro • You're doing amazing!
        </p>
        <h2 style={{ color: "#cc66cc", marginBottom: "10px" }}>🎥 Watch Video for today!</h2>
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/cFbajFMZaS4"
            title="Devo Intro"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          ></iframe>
        </div>
      </div>

      {/* Emoji Reaction Row */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        {["🥹", "🙌", "💗", "✨"].map((em, i) => (
          <button
            key={i}
            onClick={() => setReaction(em)}
            style={{
              fontSize: "18px",
              backgroundColor: reaction === em ? "#fff0f8" : "white",
              border: "2px solid #ff66b2",
              borderRadius: "12px",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {em}
          </button>
        ))}
      </div>

      <h3 style={{ textAlign: "center", color: "#cc66cc", marginBottom: "10px" }}>
        EXPLORE MORE PLANS 🤩
      </h3>

      <div style={playlistGrid}>
        {biblePlans.map((plan, index) => (
          <div key={index} style={playlistCard}>
            <img src={plan.imageUrl} alt={plan.title} style={playlistThumbnail} />
            <div style={{ padding: "12px" }}>
              <h4 style={{ margin: "6px 0", color: "#ff69b4", fontSize: "16px" }}>{plan.title}</h4>
              <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#cc66cc" }}>{plan.duration}</p>
              <button
                onClick={async () => {
                  await postJoinedPlan(plan);
                  navigate("/plan", {
                    state: {
                      planTitle: plan.title,
                      imageUrl: plan.imageUrl,
                    },
                  });
                }}
                style={playBtn}
              >
                ▶ Play Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const playlistGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "center",
};

const playlistCard = {
  width: "220px",
  backgroundColor: "#fff0fb",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out",
};

const playlistThumbnail = {
  width: "100%",
  height: "130px",
  objectFit: "cover",
};

const playBtn = {
  backgroundColor: "#ff66b2",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
};

export default Watch;
