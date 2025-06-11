// src/pages/Friends.js
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { FaBookOpen } from 'react-icons/fa';

function Friends() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [pollVotes, setPollVotes] = useState({ optionA: 0, optionB: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const fresh = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(fresh);
    });
    return () => unsub();
  }, []);

  const toggleReaction = async (postId, field) => {
    try {
      const current = posts.find((p) => p.id === postId)?.reactions?.[field] || false;
      await updateDoc(doc(db, "posts", postId), {
        [`reactions.${field}`]: !current,
      });
    } catch (e) {
      console.error("reaction error", e);
    }
  };

  const fill = (isOn) => (isOn ? "#ffc3e6" : "transparent");

  const vote = (option) => {
    if (hasVoted) return;
    setPollVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
    setHasVoted(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: `
          radial-gradient(circle at 20% 30%, #ffe4f1, transparent 70%),
          radial-gradient(circle at 80% 70%, #f7d9ff, transparent 70%),
          linear-gradient(135deg, #ffeaf4, #f3e0ff)
        `,
        backgroundAttachment: "fixed",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top-right Journal + Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => navigate('/journal')}
          style={{
            backgroundColor: '#fceaff',
            border: 'none',
            borderRadius: '16px',
            padding: '12px',
            fontSize: '20px',
            color: '#b94ec2',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <FaBookOpen size={22} style={{ marginRight: '4px' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
        </button>
      </div>

      {/* Poll Section */}
      <div
        style={{
          backgroundColor: "#ffe4fa",
          borderRadius: "20px",
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto 30px",
          boxShadow: "0 6px 20px rgba(255, 192, 236, 0.4)",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
          color: "#a64ac9",
        }}
      >
        <h3 style={{ marginBottom: "14px", fontSize: "18px" }}>✨ Poll of the Day:</h3>
        <p style={{ fontWeight: "600", fontSize: "16px", marginBottom: "18px" }}>
          Would you rather journal on paper 📖 or digitally 💻?
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => vote("optionA")}
            disabled={hasVoted}
            style={{
              backgroundColor: "#fbcfe8",
              border: "none",
              borderRadius: "16px",
              padding: "10px 20px",
              fontWeight: "600",
              cursor: hasVoted ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Paper 📖 ({pollVotes.optionA})
          </button>
          <button
            onClick={() => vote("optionB")}
            disabled={hasVoted}
            style={{
              backgroundColor: "#ddd6fe",
              border: "none",
              borderRadius: "16px",
              padding: "10px 20px",
              fontWeight: "600",
              cursor: hasVoted ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Digital 💻 ({pollVotes.optionB})
          </button>
        </div>
        {hasVoted && (
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#9d4edd" }}>
            Thanks for voting!
          </p>
        )}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          No posts yet. Be the first to share!
        </p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "#f3e8ff",
              borderRadius: "24px",
              padding: "24px",
              margin: "20px auto",
              maxWidth: "640px",
              boxShadow: "0 12px 32px rgba(229, 171, 255, 0.45)",
              fontFamily: "'Poppins', sans-serif",
              color: "#5a189a",
            }}
          >
            <h4 style={{ margin: 0, color: "#b488f7", fontWeight: "600", fontSize: "16px" }}>
              ✨ <span style={{ color: "#a855f7" }}>DiaryGirl</span>
            </h4>

            {post.type === "joinedPlan" && <p style={textStyle}>📘 Joined the {post.planTitle} Plan</p>}
            {post.type === "verse" && <p style={textStyle}>📖 Shared a Verse</p>}
            {post.type === "featuredVideo" && (
              <p style={textStyle}>🎬 Shared a Video: <strong>{post.videoTitle}</strong></p>
            )}
            {!post.type && <p style={textStyle}>Shared a Declaration</p>}

            {post.type === "verse" && (
              <div
                style={{
                  backgroundColor: "#f6edff",
                  borderRadius: "20px",
                  padding: "20px",
                  margin: "20px auto",
                  maxWidth: "600px",
                  boxShadow: "0 6px 12px rgba(228, 194, 255, 0.3)",
                }}
              >
                <strong>{post.verse_reference}</strong> — <span style={{ fontStyle: "italic" }}>{post.verse_text}</span>
              </div>
            )}

            {post.type === "featuredVideo" && post.videoUrl && (
              <video
                controls
                style={{
                  width: "100%",
                  aspectRatio: "9/16",
                  borderRadius: "12px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              >
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <div style={{ marginTop: "12px" }}>
              <button
                title="Love"
                onClick={() => toggleReaction(post.id, "heart")}
                style={reactionStyle(fill(post.reactions?.heart))}
              >
                🩷
              </button>
              <button
                title="Cheer"
                onClick={() => toggleReaction(post.id, "thumb")}
                style={reactionStyle(fill(post.reactions?.thumb))}
              >
                ☺️
              </button>
              <button
                title="Ask"
                onClick={() => toggleReaction(post.id, "question")}
                style={reactionStyle(fill(post.reactions?.question))}
              >
                🤭
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#c4a4dd", marginTop: "12px" }}>
              Posted: {post.createdAt?.toDate().toLocaleString() || "Just now"}
            </p>
          </div>
        ))
      )}

      {/* Media Queries for Responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .playlistGrid {
              flex-direction: column;
              gap: 10px;
            }
            .playlistCard {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

const textStyle = {
  margin: "6px 0 12px",
  fontWeight: "600",
  fontSize: "18px",
  fontFamily: "'Baloo 2', cursive",
  color: "#5E2B97",
  textShadow: "0px 1px 2px rgba(255, 255, 255, 0.5)",
};

const reactionStyle = (bg) => ({
  backgroundColor: bg,
  border: "2px solid #f9a8d4",
  borderRadius: "14px",
  padding: "6px 14px",
  marginRight: "10px",
  fontSize: "20px",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
});

export default Friends;
