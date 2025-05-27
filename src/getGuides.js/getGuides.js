// src/api/getGuides.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../pages/Firebase"; // make sure this matches your file path

// src/api/getGuides.js

const guides = [
  {
    keyword: "lonely",
    title: "✨ Guide for Feeling Alone",
    videoUrl: "https://youtube.com/shorts/Co8Kq0ZKWPQ?feature=share", // make sure this file is in your public/videos folder
    verse: "“I will never leave you or forsake you.” – Hebrews 13:5",
    prayer: "Dear God, remind me that You are always with me, even when I feel alone.",
    declaration: "I am never alone. God is with me and for me."
  },
  {
    keyword: "anxious",
    title: "✨ Guide for Feeling Anxious",
    videoUrl: "/videos/anxious.mp4",
    verse: "“Do not be anxious about anything...” – Philippians 4:6",
    prayer: "Jesus, calm my heart and help me trust You with my worries.",
    declaration: "I have peace because God is in control."
  }
];

export default guides;
