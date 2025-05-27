// src/ShareSheet.jsx
import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

export default function ShareSheet({
  open,
  onDismiss,
  onStory,
  onFeed,
  onLink,
  onExternal,
  onReel
}) {
  const option = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      snapPoints={["30%"]}
      blocking={false}
    >
      <div style={{ display: "flex", justifyContent: "space-around", padding: "16px" }}>
        <div onClick={onStory} style={option}>
          ⭕️<br/>Story
        </div>
        <div onClick={onFeed} style={option}>
          📰<br/>Feed
        </div>
        <div onClick={onLink} style={option}>
          🔗<br/>Link
        </div>
        <div onClick={onExternal} style={option}>
          🔄<br/>Share to
        </div>
        <div onClick={onReel} style={option}>
          🎞️<br/>Reel
        </div>
      </div>
    </BottomSheet>
  );
}
