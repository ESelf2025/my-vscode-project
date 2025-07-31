import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./Watch.css";

const videoData = {
  "Made on Purpose": [
    "https://example.com/video1.mp4",
    "https://example.com/video2.mp4",
    "https://example.com/video3.mp4",
    "https://example.com/video4.mp4",
    "https://example.com/video5.mp4",
    "https://example.com/video6.mp4",
    "https://example.com/video7.mp4",
    "https://example.com/video8.mp4",
    "https://example.com/video9.mp4",
    "https://example.com/video10.mp4",
  ],
  "Not Alone, Never Were": [
    "https://example.com/plan2-video1.mp4",
    // ...
  ],
  "Peace Over Panic": [
    "https://example.com/plan3-video1.mp4",
    // ...
  ],
  // Add the rest of your plans and video links here...
};

function Watch() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = Object.keys(videoData);

  if (selectedPlan) {
    return (
      <div className="watch-page">
        <h2>{selectedPlan}</h2>
        <button onClick={() => setSelectedPlan(null)}>← Back to Plans</button>
        <div className="video-list">
          {videoData[selectedPlan].map((url, index) => (
            <div className="video-card" key={index}>
              <ReactPlayer url={url} controls width="100%" height="240px" />
              <p>Day {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="plan-grid">
      <h2>Explore More Plans 🤭</h2>
      <div className="grid">
        {plans.map((planTitle) => (
          <div className="plan-card" key={planTitle}>
            <img src="https://via.placeholder.com/100x60" alt={planTitle} />
            <h3>{planTitle}</h3>
            <p>10 videos</p>
            <button onClick={() => setSelectedPlan(planTitle)}>▶ Play Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watch;
