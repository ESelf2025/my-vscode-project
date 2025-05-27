import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

function PlanPage() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPlanVideos = async () => {
      try {
        const q = query(collection(db, "planVideos"), orderBy("day", "asc"));
        const querySnapshot = await getDocs(q);
        const videoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          playing: false,
          ...doc.data(),
        }));
        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching plan videos:", error);
      }
    };

    fetchPlanVideos();
  }, []);

  const handleSelect = (index) => {
    const resetVideos = videos.map((v, i) => ({
      ...v,
      playing: false,
    }));
    setVideos(resetVideos);
    setCurrentIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlay = () => {
    const updated = [...videos];
    updated[currentIndex].playing = true;
    setVideos(updated);
  };

  const currentVideo = videos[currentIndex];
  const handleShare = async () => {
    try {
      await addDoc(collection(db, "posts"), {
        user: "DiaryGirl",
        type: "featuredVideo",
        videoTitle: "Not Alone – Intro",
        thumbnailUrl: "https://your-storage-url.com/thumbnail.jpg", // optional preview
        videoUrl: "https://your-storage-url.com/video.mp4", // 🟢 THE ACTUAL VIDEO FILE!
        createdAt: serverTimestamp(),
        reactions: {},
      });
      alert("Devotional shared to feed!");
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  
  return (
    <div
      style={{
        backgroundColor: "#FFEFF6",
        padding: "30px 20px",
        minHeight: "100vh",
        textAlign: "center",
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      {/* 🎥 Main Video Preview */}
      {currentVideo && (
        <>
          {!currentVideo.playing ? (
            <div
              style={{
                width: "280px",
                height: "500px",
                borderRadius: "25px",
                backgroundImage: `url(${currentVideo.thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                position: "relative",
                boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                margin: "0 auto",
              }}
              onClick={handlePlay}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "44px",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: "50%",
                  padding: "10px 18px",
                }}
              >
                ▶️
              </div>
            </div>
          ) : (
            <video
              controls
              style={{
                width: "280px",
                height: "500px",
                borderRadius: "25px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
              }}
              src={currentVideo.videoUrl}
            />
          )}

          {/* ✏️ Title + Description */}
          <h3 style={{ marginTop: "15px", fontSize: "20px", fontWeight: "bold" }}>
            {currentVideo.planTitle}
          </h3>
          {currentVideo.description && (
  <div
    className="devotional-content"
    style={{
      backgroundColor: "#fff0f5",
      padding: "20px",
      borderRadius: "16px",
      textAlign: "left",
      color: "#444",
      lineHeight: "1.6",
      maxWidth: "600px",
      margin: "0 auto 20px",
      fontSize: "15px",
      fontFamily: "'Quicksand', sans-serif",
    }}
    dangerouslySetInnerHTML={{ __html: currentVideo.description }}
  />
)}

          {/* 💓 Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <button style={btnStyle}>💓 Like</button>
            <button style={btnStyle} onClick={handleShare}>📤 Share</button>
            <button style={btnStyle}>📌 Save</button>
          </div>
        </>
      )}

      {/* 🎬 Playlist */}
      <h4
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#B05ACD",
          marginBottom: "15px",
        }}
      >
        🎬 Plan Playlist
      </h4>

      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "10px",
          paddingTop: "5px",
          justifyContent: "center",
        }}
      >
        {videos.map((vid, index) => (
          <div
            key={vid.id}
            onClick={() => handleSelect(index)}
            style={{
              minWidth: "100px",
              width: "100px",
              height: "150px",
              borderRadius: "25px",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow:
                currentIndex === index
                  ? "0 4px 12px rgba(186, 102, 255, 0.3)"
                  : "0 2px 6px rgba(0,0,0,0.1)",
              backgroundColor: "#f4e6ff",
            }}
          >
            {vid.thumbnailUrl && (
              <img
                src={vid.thumbnailUrl}
                alt={vid.planTitle}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "inherit",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              />
            )}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                backgroundColor: "rgba(255,255,255,0.8)",
                width: "100%",
                paddingTop: "8px",
                paddingBottom: "6px",
                textAlign: "center",
                borderBottomLeftRadius: "25px",
                borderBottomRightRadius: "25px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {vid.day === 0 ? "Intro" : `Day ${vid.day}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: "none",
  padding: "8px 16px",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

export default PlanPage;
