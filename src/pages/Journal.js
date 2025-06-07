import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./Firebase";
import { getGuides } from "./getGuides";

function Journal() {
  const [entry, setEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [mode, setMode] = useState(null); // "talk" or "type"
  const [videoFile, setVideoFile] = useState(null);
  const [videoEmotion, setVideoEmotion] = useState("");

  // New states for customization in TYPE mode
  const [customBackground, setCustomBackground] = useState("#ffffff");
  const [customFont, setCustomFont] = useState("Arial, sans-serif");
  const [hashtags, setHashtags] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [voiceMemo, setVoiceMemo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const snapshot = await getDocs(collection(db, "journalEntries"));
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSavedEntries(data);
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      const data = await getGuides();
      setAllGuides(data);
    };
    fetchGuides();
  }, []);

  const handleSave = async () => {
    if (entry.trim() === "") return;
    
    // Upload photo if available
    let photoURL = "";
    if (photoFile) {
      const photoRef = ref(storage, `journalPhotos/${Date.now()}-${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      photoURL = await getDownloadURL(photoRef);
    }

    // Upload voice memo if available
    let voiceMemoURL = "";
    if (voiceMemo) {
      const voiceRef = ref(storage, `journalVoiceMemos/${Date.now()}-${voiceMemo.name}`);
      await uploadBytes(voiceRef, voiceMemo);
      voiceMemoURL = await getDownloadURL(voiceRef);
    }

    const newEntry = {
      text: entry,
      emotion: entry.toUpperCase(),
      customBackground,
      customFont,
      hashtags,
      photoURL: photoURL || null,
      voiceMemoURL: voiceMemoURL || null,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "journalEntries"), newEntry);
    setSavedEntries((prev) => [...prev, { ...newEntry, createdAt: new Date() }]);
    setEntry("");
    setPhotoFile(null);
    setVoiceMemo(null);
    setHashtags("");

    const match = allGuides.find((guide) =>
      guide.keyword && entry.toLowerCase().includes(guide.keyword.toLowerCase())
    );
    setMatchedGuide(match || null);
  };

  const handleVideoUpload = async () => {
    if (!videoFile || !videoEmotion)
      return alert("Please select a video and emotion");

    const videoRef = ref(storage, `journalVideos/${Date.now()}-${videoFile.name}`);
    await uploadBytes(videoRef, videoFile);
    const videoUrl = await getDownloadURL(videoRef);

    const newEntry = {
      videoUrl,
      emotion: videoEmotion.toUpperCase(),
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "journalEntries"), newEntry);
    setSavedEntries((prev) => [...prev, { ...newEntry, createdAt: new Date() }]);
    setVideoFile(null);
    setVideoEmotion("");

    const match = allGuides.find((guide) =>
      guide.keyword && videoEmotion.toLowerCase().includes(guide.keyword.toLowerCase())
    );
    setMatchedGuide(match || null);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  useEffect(() => {
    if (isRecording) {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [isRecording]);

  const startRecording = () => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const saveRecording = async () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoFile = new File([blob], `webcam-video-${Date.now()}.webm`, {
        type: 'video/webm',
      });

      const videoRef = ref(storage, `journalVideos/${videoFile.name}`);
      await uploadBytes(videoRef, videoFile);
      const videoUrl = await getDownloadURL(videoRef);

      const newEntry = {
        videoUrl,
        emotion: videoEmotion.toUpperCase(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'journalEntries'), newEntry);
      setSavedEntries((prev) => [...prev, { ...newEntry, createdAt: new Date() }]);
      setRecordedChunks([]);
      setVideoEmotion('');

      const match = allGuides.find((guide) =>
        guide.keyword && videoEmotion.toLowerCase().includes(guide.keyword.toLowerCase())
      );
      setMatchedGuide(match || null);
    }
  };

  return (
    <div
  style={{
    position: "relative", // add this line
    padding: "30px",
    minHeight: "100vh",
    background: `
  }}
>


        `,
      }}
    >
      {/* Welcome Message */}
      <div
        style={{
          fontFamily: "'Chewy', cursive",
          fontSize: "36px",
          color: "#fff",
          textShadow: "2px 2px #ffc0f9",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
      </div>
  
      {/* Inner "Page" Frame */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          borderRadius: "30px",
          padding: "50px 20px",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0px 8px 40px #fbd3f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {/* TYPE Button */}
        <div
          onClick={() => setMode("type")}
          style={{
            width: "160px",
            height: "160px",
            backgroundColor: "#d6b3ff", // Changed from blue to purple
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Chewy', cursive",
            fontSize: "24px",
            color: "#fff",
            boxShadow: "0 0 30px #d1b3ff", // Changed from blue to purple
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          TAP TO JOURNAL
        </div>

        </div>

      {/* TYPE MODE */}
      {mode === "type" && (
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#e1e9ff",
            padding: "20px",
            borderRadius: "20px",
            fontFamily: "Chewy, cursive",
            gap: "10px",

          }}
        >
          <div
            style={{
              backgroundColor: "#b3b3ff",
              color: "white",
              padding: "10px 15px",
              borderRadius: "20px",
              width: "fit-content",
              marginBottom: "15px",
              fontFamily: "'Chewy', cursive"

            }}
          >
            whatcha thinking about?
          </div>

          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Type here like you're texting your diary..."
            style={{
              width: "100%",
              height: "130px",
              padding: "12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              fontSize: "16px",
              backgroundColor: customBackground,
              resize: "none",
            }}
          />

          {/* NEW FEATURE CONTROLS */}
          <div style={{ marginTop: "15px" }}>
            {/* Photo Upload */}
            <div style={{ marginBottom: "10px" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
            </div>

            {/* Voice Memo Upload */}
            <div style={{ marginBottom: "10px" }}>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setVoiceMemo(e.target.files[0])}
              />
            </div>

            {/* Emoji Button */}
            <button
              onClick={() => setEntry(entry + " 😊")}
              style={{
                marginRight: "10px",
                backgroundColor: "#ffd9ec",
                border: "none",
                borderRadius: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              😊 Emoji
            </button>

            {/* Font Selector */}
            <select
              onChange={(e) => setCustomFont(e.target.value)}
              value={customFont}
              style={{
                marginRight: "10px",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Georgia', serif">Georgia</option>
            </select>

            {/* Hashtag Input */}
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Enter hashtags, separated by commas"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Background Color Picker */}
            <div style={{ marginTop: "10px" }}>
              <label style={{ marginRight: "10px" }}>Background Color:</label>
              <input
                type="color"
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
              />
            </div>
          </div>

          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#cc99ff",
                color: "white",
                padding: "10px 18px",
                border: "none",
                borderRadius: "25px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              💾 Save
            </button>
          </div>
        </div>
      )}

      {/* TALK MODE */}
      {mode === "talk" && (
        <div style={{
          marginTop: "30px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}>
          <h2 style={{ fontFamily: "'Chewy', cursive", color: "#333" }}>🎥 Record or Upload Your Diary Video</h2>

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "300px",
              aspectRatio: "9/16",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#000",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            ></video>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsRecording((prev) => !prev)}
              style={{
                backgroundColor: isRecording ? "#ff4d4d" : "#4caf50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s ease",
              }}
            >
              {isRecording ? "Stop Webcam" : "Start Webcam"}
            </button>

            <button
              onClick={saveRecording}
              style={{
                backgroundColor: "#2196f3",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s ease",
              }}
            >
              Save Recording
            </button>
          </div>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "80%",
            }}
          />

          <input
            type="text"
            placeholder="How are you feeling? (e.g. lonely)"
            value={videoEmotion}
            onChange={(e) => setVideoEmotion(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "80%",
            }}
          />

          <button
            onClick={handleVideoUpload}
            style={{
              marginTop: "15px",
              backgroundColor: "#ff4081",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
          >
            ⬆️ Upload Video
          </button>
        </div>
      )}

      {/* GUIDE MATCH */}
      {matchedGuide && (
        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            backgroundColor: "#fff0f8",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>YOUR DIARY SAYS</h2>
          <video
  controls
  style={{
    // fill the container...
    width: "100%",
    // ...but keep a 9:16 (portrait) ratio
    aspectRatio: "9/16",
    // optional: don’t let it grow wider than 360px
    maxWidth: "360px",
    // center it
    margin: "0 auto 20px",
    // rounded corners & cover
    borderRadius: "12px",
    objectFit: "cover",
  }}
>
  <source src={matchedGuide.videoUrl} type="video/mp4" />
  Your browser does not support this video tag.
</video>


          <h3 style={{ marginTop: "15px", color: "#cc66cc" }}>
            ✨ {matchedGuide.Title}
          </h3>
          <p>
            <strong>📖 Bible Verse:</strong> {matchedGuide.bibleVerse}
          </p>
          <p>
            <strong>🙏 Prayer:</strong> {matchedGuide.prayer}
          </p>
          <p>
            <strong>🪞 Declaration:</strong> {matchedGuide.declaration}
          </p>
        </div>
      )}
    </div>
  );
}

export default Journal;
