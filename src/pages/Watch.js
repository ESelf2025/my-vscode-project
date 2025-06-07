import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./Firebase";
import { useNavigate } from "react-router-dom";

const currentUserId = "EDENSELFF";

const biblePlans = [
  { id: 1, title: "Made on Purpose", duration: "10 videos", imageUrl: "/assets/plans/IMG_4699.jpg" },
  { id: 2, title: "Not Alone, Never Were", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 3, title: "Peace Over Panic", duration: "10 videos", imageUrl: "/assets/plans/identity.jpg" },
  { id: 4, title: "What I Have Is Enough", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 5, title: "There’s Room for Me", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 6, title: "When Fire Flares Up", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 7, title: "When Everyone’s Looking", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 8, title: "When Tears Fall", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 9, title: "Can’t Stop Smiling", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 10, title: "Who Even Am I?", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 11, title: "This Joy is Real", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 12, title: "Held and Known", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 13, title: "Too Much All At Once", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 14, title: "I Messed Up", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
  { id: 15, title: "Maybe This Time", duration: "10 videos", imageUrl: "/assets/plans/peace.jpg" },
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
  const [nextVideo, setNextVideo] = useState(null);
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

    async function fetchNextVideo() {
      const q = query(collection(db, "planVideos"), orderBy("day", "asc"));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const next = all.find((v) => !v.playing);
      setNextVideo(next);
    }

    fetchPinnedPlan();
    fetchNextVideo();
  }, []);

  const moods = ["😔", "😊", "😡", "🥹"];
  const progress = nextVideo ? Math.min((nextVideo.day / 10) * 100, 100) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: `
          radial-gradient(circle at 20% 30%, #ffe4f1, transparent 70%),
          radial-gradient(circle at 80% 70%, #f7d9ff, transparent 70%),
          linear-gradient(135deg, #ffeaf4, #f3e0ff)
        `,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Mini Me Greeting */}
    

      {/* Mood Filter */}
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

      {nextVideo && (
        <>
          {/* Progress Bar */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p style={{ color: "#cc66cc", fontWeight: "600" }}>
              Day {nextVideo.day} of 10 • You're doing amazing!
            </p>
            <div style={{ backgroundColor: "#f0c3e8", borderRadius: "20px", height: "10px", width: "60%", margin: "0 auto" }}>
              <div style={{ width: `${progress}%`, backgroundColor: "#ff69b4", height: "100%", borderRadius: "20px" }} />
            </div>
          </div>

          <h2 style={{ color: "#cc66cc", textAlign: "center", marginBottom: "10px" }}>
            🎥 Watch Video for today!
          </h2>

          <div style={{ ...playlistCard, margin: "0 auto 30px", width: "280px" }}>
            <div
              style={{
                width: "100%",
                height: "400px",
                backgroundImage: `url(${nextVideo.thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            />
            <div style={{ padding: "12px" }}>
              <h4 style={{ margin: "6px 0", color: "#ff69b4", fontSize: "16px" }}>{nextVideo.planTitle}</h4>
              <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#cc66cc" }}>
                {nextVideo.day === 0 ? "Intro" : `Day ${nextVideo.day}`}
              </p>
              <button
                onClick={() =>
                  navigate("/plan", {
                    state: {
                      planTitle: nextVideo.planTitle,
                      imageUrl: nextVideo.thumbnailUrl,
                    },
                  })
                }
                style={playBtn}
              >
                ▶ Continue Plan
              </button>

              {/* Emoji Reaction Row */}
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
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
            </div>
          </div>

          {/* Tomorrow Banner */}
          <div style={{ textAlign: "center", color: "#7e22ce", fontWeight: "bold", backgroundColor: "#f5d1f9", padding: "10px 20px", borderRadius: "12px", width: "fit-content", margin: "0 auto 30px" }}>
            🌅 Going live tomorrow at 7am!
          </div>
        </>
      )}

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

// 🌸 Styles
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
