import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function AvatarMatcher() {
  const imageRef = useRef(null);
  const [avatarMatch, setAvatarMatch] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const image = await faceapi.bufferToImage(file);
    imageRef.current.src = image.src;

    // Wait for image to load before detecting
    imageRef.current.onload = async () => {
      await loadModels();

      const detection = await faceapi
        .detectSingleFace(imageRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (!detection) {
        alert("No face found. Try another photo.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = imageRef.current.width;
      canvas.height = imageRef.current.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const avg = getAverageColor(imageData);
      const matchedSkinTone = matchSkinTone(avg);

      // You can add logic here for hair and eyes too
      setAvatarMatch({
        skinTone: matchedSkinTone,
        hair: 'default',
        eyes: 'default',
      });
    };
  };

  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  };

  const getAverageColor = (imageData) => {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }
    const total = imageData.data.length / 4;
    return {
      r: Math.round(r / total),
      g: Math.round(g / total),
      b: Math.round(b / total),
    };
  };

  const matchSkinTone = ({ r, g, b }) => {
    if (r > 200 && g > 180) return 'light1';
    if (r > 160) return 'light2';
    if (r > 100) return 'medium';
    return 'dark';
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Snap & Style</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br />
      <img ref={imageRef} alt="Selfie Preview" style={{ display: 'none' }} />

      {avatarMatch && (
        <div>
          <h4>Matched Avatar</h4>
          <p>Skin Tone: {avatarMatch.skinTone}</p>
          <p>Hair: {avatarMatch.hair}</p>
          <p>Eyes: {avatarMatch.eyes}</p>
          {/* Here you can render a real avatar image based on matches */}
        </div>
      )}
    </div>
  );
}
