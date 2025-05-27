import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./Firebase";
import { getGuides } from "./getGuides";

/* ——— replace with auth.currentUser.uid if you have Firebase auth wired ——— */
const currentUserId = "EDENSELFF";

function Profile() {
  /* ——— top‑level UI state ——— */
  const [activeTab, setActiveTab] = useState(null);
  const [searchInput, setSearchInput] = useState("");          // ✅ FIXED
  const [showEditModal, setShowEditModal]   = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  /* ——— profile text ——— */
  const [displayName, setDisplayName] = useState("EDENSELFF");
  const [bio,         setBio]         = useState(
    "My name is Eden Self! I love Jesus and cheer! 💖"
  );

  /* ——— journal / guide data ——— */
  const [entries,       setEntries]       = useState([]);
  const [selectedDate,  setSelectedDate]  = useState(null);
  const [matchedEntry,  setMatchedEntry]  = useState(null);
  const [matchedGuide,  setMatchedGuide]  = useState(null);

  /* ——— saved‑video data ——— */
  const [savedVideos, setSavedVideos] = useState([]);

  /* —— pull journal entries once —— */
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "journalEntries"));
      const data = snap.docs.map((d) => {
        const e = d.data();
        const createdAt = e.createdAt?.seconds
          ? new Date(e.createdAt.seconds * 1000)
          : new Date();
        return { ...e, createdAt };
      });
      setEntries(data);
    })();
  }, []);

  /* —— pull *my* saved videos (no composite index needed) —— */
  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "savedVideos"),
        where("userId", "==", currentUserId)
      );
      const snap = await getDocs(q);
      // Sort newest‑first right here on the client
      const vids = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setSavedVideos(vids);
    })();
  }, []);

  /* —— calendar click handler —— */
  const handleDateClick = (day) => {
    setSelectedDate(day);
    const entry = entries.find((e) => {
      const d = e.createdAt;
      return d.getDate() === day && d.getMonth() === 3 && d.getFullYear() === 2025;
    });
    setMatchedEntry(entry || null);

    if (entry && entry.emotion) {
      getGuides().then((guides) => {
        const match = guides.find(
          (g) => g.keyword && entry.emotion.toLowerCase().includes(g.keyword.toLowerCase())
        );
        setMatchedGuide(match || null);
      });
    } else {
      setMatchedGuide(null);
    }
  };

  /* ——— render ——— */
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
      {/* avatar + name */}
      <div style={{ textAlign: "center" }}>
        <div style={avatar}>👤</div>

        <h2 style={nameBanner}>{displayName}</h2>

        <div style={buttonRow}>
          <button style={pill("#d0d9f2")} onClick={() => setShowEditModal(true)}>
            Edit profile
          </button>
          <button style={pill("#e5f0ff")} onClick={() => setShowShareModal(true)}>
            Share profile
          </button>
        </div>

        <p style={{ fontSize: "16px", color: "#555" }}>{bio}</p>
      </div>

      {/* bubble nav */}
      <div style={bubbleRow}>
        <div title="Friends"  onClick={() => setActiveTab("friends")}  style={circle("#cce5ff")}>👯‍♀️</div>
        <div title="Activity" onClick={() => setActiveTab("history")}  style={circle("#ffcfd8")}>📊</div>
        <div title="Saved"    onClick={() => setActiveTab("saved")}    style={circle("#e2ffe0")}>📌</div>
      </div>

      {/* FRIENDS TAB */}
      {activeTab === "friends" && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Search by username or phone number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={searchBox}
          />

          {/* invite card */}
          <div style={inviteCard}>
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
              alt="merch"
              style={{ width: "100%", borderRadius: "16px", marginBottom: "20px" }}
            />
            <p style={inviteText}>
              INVITE 10 FRIENDS{"\n"}TO WIN A{"\n"}FREE PIECE OF MERCH!
            </p>
            <button style={pill("#fff", "#cc66cc")} onClick={() => alert("Link shared!")}>
              📤 Share
            </button>
          </div>
        </div>
      )}

      {/* ACTIVITY TAB */}
      {activeTab === "history" && (
        <div style={{ marginTop: "40px" }}>
          <h3 style={monthHeader}>April 2025</h3>

          {/* calendar grid */}
          <div style={calendarGrid}>
            {[...Array(30).keys()].map((i) => (
              <div
                key={i}
                onClick={() => handleDateClick(i + 1)}
                style={{
                  ...dateCell(i),
                  backgroundColor:
                    selectedDate === i + 1
                      ? "#cc66cc"
                      : ["#cde5ff", "#ffcfd8", "#e0d1f9"][i % 3],
                  color: selectedDate === i + 1 ? "white" : "#444",
                  fontWeight: selectedDate === i + 1 ? "bold" : "normal",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* daily log boxes */}
          {selectedDate && (
            <div style={logColumn}>
              <LogBox title="📖 Bible"    content="Not logged yet 📖"                  color="#cce5ff" />
              <LogBox title="📓 Journal"  content={matchedEntry?.text || "No entry"}  color="#ffcfd8" />
              <LogBox
                title="🙏 Devotional"
                content={
                  matchedGuide
                    ? `${matchedGuide.bibleVerse}\n${matchedGuide.prayer}\n${matchedGuide.declaration}`
                    : "No devotional match"
                }
                color="#e0d1f9"
              />
            </div>
          )}
        </div>
      )}

      {/* SAVED TAB */}
      {activeTab === "saved" && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          {savedVideos.length === 0 ? (
            <p style={{ color: "#777" }}>You haven’t saved any videos yet.</p>
          ) : (
            <div style={savedGrid}>
             {savedVideos.map((item) =>
  item.videoURL ? (
    /* ── saved video ── */
    <video
      key={item.id}
      src={item.videoURL}
      controls
      style={savedThumb}
    />
  ) : (
    /* ── saved verse ── */
    <div
      key={item.id}
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "200px",
      }}
    >
      <strong>{item.verse_reference}</strong>
      <p style={{ fontStyle: "italic", marginTop: "6px" }}>
        {item.verse_text}
      </p>
    </div>
  )
)}

            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h3>Edit Profile</h3>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            style={inputStyle}
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your bio..."
            style={{ ...inputStyle, height: "80px" }}
          />
          <button style={pill("#cc66cc", "#fff")} onClick={() => setShowEditModal(false)}>
            Save
          </button>
        </Modal>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <Modal onClose={() => setShowShareModal(false)}>
          <h3>Share Your Profile 💕</h3>
          <p style={{ margin: "10px 0" }}>Copy your profile link:</p>
          <input value="https://diaryapp.com/edenselff" readOnly style={inputStyle} />
          <button
            style={pill("#cc66cc", "#fff")}
            onClick={() => navigator.clipboard.writeText("https://diaryapp.com/edenselff")}
          >
            Copy
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ——— reusable style helpers ——— */
const avatar = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  margin: "0 auto 10px",
  fontSize: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#bbb",
};

const nameBanner = {
  backgroundColor: "#f9ccf7",
  color: "#cc33cc",
  padding: "6px 14px",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: "18px",
  letterSpacing: "2px",
  marginBottom: "10px",
};

const buttonRow = { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" };
const bubbleRow  = { display: "flex", justifyContent: "center", gap: "40px", marginTop: "40px" };

function pill(bg, color = "#444") {
  return {
    backgroundColor: bg,
    color,
    border: "none",
    padding: "10px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  };
}
function circle(bg) {
  return {
    width: "80px",
    height: "80px",
    backgroundColor: bg,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "26px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };
}

const searchBox = {
  padding: "12px",
  borderRadius: "30px",
  border: "1px solid #ccc",
  width: "80%",
  marginBottom: "20px",
};

const inviteCard = {
  backgroundColor: "#ffd6ea",
  borderRadius: "50px",
  maxWidth: "340px",
  margin: "0 auto",
  padding: "30px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};
const inviteText = { fontSize: "16px", fontWeight: "bold", color: "#cc33cc", whiteSpace: "pre-line" };

const monthHeader = { textAlign: "center", color: "#cc66cc", fontWeight: "bold" };
const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "6px",
  padding: "10px 20px",
};
const dateCell = (i) => ({
  borderRadius: "12px",
  padding: "10px 0",
  textAlign: "center",
  fontSize: "14px",
  cursor: "pointer",
});
const logColumn = {
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "0 20px",
};

function LogBox({ title, content, color }) {
  return (
    <div style={{
      backgroundColor: color,
      padding: "16px",
      borderRadius: "16px",
      whiteSpace: "pre-line",
    }}>
      <h4 style={{ marginBottom: "6px", color: "#333" }}>{title}</h4>
      <p style={{ fontSize: "14px", color: "#444" }}>{content}</p>
    </div>
  );
}

const savedGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "20px",
  padding: "0 20px",
};
const savedThumb = {
  width: "100%",
  aspectRatio: "9/16",
  borderRadius: "12px",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "#fff0f5",
        padding: "30px",
        borderRadius: "20px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      }}>
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "12px",
  margin: "10px 0",
  border: "1px solid #ccc",
};

export default Profile;
