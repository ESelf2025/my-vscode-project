// src/StoryComposer.jsx
import React, { useRef } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function StoryComposer({ open, onDismiss, onSave, verseText }) {
  const canvasRef = useRef();

  const handleSave = async () => {
    const drawing = await canvasRef.current.exportImage("png");
    onSave({ drawing, verseText });
  };

  const smallBtn = {
    background: "#f0f0f0",
    border: "none",
    padding: "8px 12px",
    borderRadius: "20px",
    cursor: "pointer",
  };

  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      snapPoints={["75%"]}    // static 75% height
      blocking={false}
    >
      <div style={{ position: "relative", height: "100%" }}>
        {/* Top toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "8px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ cursor: "pointer" }}>⚪️</div>
          <div style={{ cursor: "pointer" }}>Aa</div>
          <div style={{ cursor: "pointer" }}>😊</div>
          <div style={{ cursor: "pointer" }}>🎵</div>
          <div style={{ cursor: "pointer" }}>⋯</div>
        </div>

        {/* Canvas & verse overlay */}
        <div
          style={{
            flex: 1,
            position: "relative",
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ReactSketchCanvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            strokeWidth={4}
            strokeColor="hotpink"
          />
          {verseText && (
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                width: "100%",
                textAlign: "center",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              {verseText}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "12px",
            borderTop: "1px solid #eee",
          }}
        >
          <button onClick={onDismiss} style={smallBtn}>
            Cancel
          </button>
          <button onClick={handleSave} style={smallBtn}>
            Your Stories
          </button>
          <button onClick={handleSave} style={smallBtn}>
            Close Friends
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
