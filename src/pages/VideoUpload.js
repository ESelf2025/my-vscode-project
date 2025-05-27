// src/pages/VideoUpload.js

import React, { useState } from "react";
import { storage } from "./Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function VideoUpload() {
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!video) return alert("Please select a video to upload!");

    const storageRef = ref(storage, `videos/${video.name}`);
    const uploadTask = uploadBytesResumable(storageRef, video);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        alert("Upload failed: " + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
        });
      }
    );
  };

  return (
    <div style={{ padding: "20px", background: "#fff0f5", minHeight: "100vh" }}>
      <h2 style={{ color: "#cc66cc" }}>📹 Upload Your Video</h2>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "10px",
          backgroundColor: "#cc66cc",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Upload Video
      </button>
      {uploadProgress > 0 && <p>Uploading: {Math.round(uploadProgress)}%</p>}
      {downloadURL && (
        <div>
          <p>✅ Uploaded! Here’s your video:</p>
          <video width="300" controls src={downloadURL}></video>
          <p style={{ wordBreak: "break-all" }}>{downloadURL}</p>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
