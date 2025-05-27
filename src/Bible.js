// ── src/pages/Bible.js ──
import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./pages/Firebase";
import bibleVerses from "./verses";
import guideVideos from "./pages/Guide";          // ← double‑check the path

/* TEMP: replace with auth.currentUser.uid once Auth is added */
const currentUserId = "EDENSELFF";

/* helper: push a verse post to Friends feed */
const repostVerseToFeed = (verse) =>
  addDoc(collection(db, "posts"), {
    type: "verse",
    verse_reference: verse.verse_reference,
    verse_text: verse.verse_text,
    createdAt: serverTimestamp(),
    reactions: { heart: false, thumb: false, question: false },
  });

/* helper: save verse for this user (shows in Profile → Saved) */
const saveVerseForUser = (verse, uid) =>
  addDoc(collection(db, "savedVideos"), {
    userId: uid,
    verse_reference: verse.verse_reference,
    verse_text: verse.verse_text,
    type: "verse",
    createdAt: serverTimestamp(),
  });

function Bible() {
  const [verse, setVerse] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  /* like / share / save state for VotD */
  const [liked, setLiked]   = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved]   = useState(false);

  /* pick Verse‑of‑the‑Day */
  useEffect(() => {
    const todayIndex = new Date().getDate() % bibleVerses.length;
    setVerse(bibleVerses[todayIndex]);
  }, []);

  /* button handlers */
  const handleLike = () => setLiked(!liked);

  const handleRepostVerse = async () => {
    if (!verse) return alert("Verse is not loaded yet!");
    if (!shared) {
      try {
        await repostVerseToFeed(verse);           // write once
      } catch (err) {
        console.error("repost error", err);
        return alert("Oops! Something went wrong.");
      }
    }
    setShared(!shared);                           // toggle pink fill
    alert("Verse shared to Friends Feed!");
  };

  const handleSave = async () => {
    if (!saved && verse) {
      await saveVerseForUser(verse, currentUserId);
    }
    setSaved(!saved);                             // toggle pink fill
  };

  /* search helpers */
  const handleSearch = () => {
    const filtered = bibleVerses.filter((v) =>
      v.emotion.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
    setSelectedEmotion(null);
  };

  const handleEmotionClick = (emotion) => {
    const filtered = bibleVerses.filter((v) => v.emotion === emotion);
    setResults(filtered.slice(0, 5));
    setSelectedEmotion(emotion);
  };

  const pinned = guideVideos.find((g) => g.emotion === selectedEmotion);

  /* pastel helper */
  const fill = (flag) => (flag ? "#ffc3e6" : "transparent");

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
      <h1 style={{ color: "#cc66cc", textAlign: "center", marginBottom: "20px" }}>
        📖 Open Your Bible, Girl
      </h1>
      <p style={{ textAlign: "center", fontSize: "18px", color: "#cc66cc" }}>
        You're never too young to understand God’s Word 💖
      </p>

      {/* Verse‑of‑the‑Day card */}
      <div
        style={{
          backgroundColor: "#f3e9f7",
          borderRadius: "16px",
          padding: "30px",
          marginTop: "30px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#ff66b2" }}>🌞 Verse of the Day</h2>
        {verse && (
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
            {verse.verse_reference} —{" "}
            <span style={{ fontStyle: "italic" }}>{verse.verse_text}</span>
          </p>
        )}
        <p style={{ fontStyle: "italic", color: "#cc66cc", marginBottom: "20px" }}>
          ✏️ What is God teaching you through this verse?
        </p>

        {/* Like • Repost • Save */}
        <div
          style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "12px" }}
        >
          <IconButton emoji="💗" label="Like"   flag={liked}  onClick={handleLike} />
          <IconButton emoji="📤" label="Repost" flag={shared} onClick={handleRepostVerse} />
          <IconButton emoji="📌" label="Save"   flag={saved}  onClick={handleSave} />
        </div>
      </div>

      {/* Search & filters */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emotion..."
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "70%",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            backgroundColor: "#ff66b2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔍 Search
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {["fear", "anxiety", "joy", "loneliness", "sadness"].map((emotion) => (
          <button
            key={emotion}
            onClick={() => handleEmotionClick(emotion)}
            style={{
              margin: "8px",
              padding: "10px 16px",
              backgroundColor: "#ffd6e7",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: selectedEmotion === emotion ? "bold" : "normal",
            }}
          >
            {emotion.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Pinned Devotional (unchanged UI) */}
      {selectedEmotion && pinned && (
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ color: "#cc33cc" }}>
            📌 A Guide for {selectedEmotion.toUpperCase()}
          </h3>
          <video
            width="320"
            controls
            style={{ borderRadius: "10px", marginBottom: "20px" }}
          >
            <source src={pinned.videoUrl} type="video/mp4" />
          </video>
          <p>
            <strong>📖 Verse:</strong> {pinned.verse}
          </p>
          <p>
            <strong>🪞 Declaration:</strong> {pinned.declaration}
          </p>
          <p>
            <strong>🙏 Prayer:</strong> {pinned.prayer}
          </p>
          <div style={{ marginTop: "10px" }}>
            <button style={miniBtn("#ffcccc")}>🩷</button>
            <button style={miniBtn("#e0ccff")}>📤 Share</button>
            <button style={miniBtn("#ccffe0")}>💾 Save</button>
          </div>
        </div>
      )}

      {/* Matching Scriptures */}
      {results.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ color: "#cc66cc" }}>
            📖 More Scriptures for {selectedEmotion?.toUpperCase()}
          </h3>
          {results.map((v, i) => (
            <p key={i}>
              <strong>{v.verse_reference}</strong> — {v.verse_text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* Reusable icon button */
function IconButton({ emoji, label, flag, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        backgroundColor: flag ? "#ffc3e6" : "transparent",
        border: "none",
        borderRadius: "8px",
        padding: "6px 14px",
        fontSize: "18px",
        cursor: "pointer",
      }}
    >
      {emoji}
    </button>
  );
}
const miniBtn = (bg) => ({
  marginRight: "10px",
  backgroundColor: bg,
  padding: "6px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
});

export default Bible;
