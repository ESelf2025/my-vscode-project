// App.js
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./pages/Firebase";
import './App.css';
import BottomNavBar from './BottomNavBar';

import Journal from "./pages/Journal";
import Friends from "./pages/Friends";
import Bible from "./Bible";
import EmotionPicker from "./pages/EmotionPicker";
import EmotionPage from "./pages/EmotionPage";
import Watch from "./pages/Watch";
import VideoUpload from "./pages/VideoUpload";
import Profile from "./pages/Profile";
import PlanPlayer from "./pages/PlanPlayer";
import Login from "./Login";
import Register from "./pages/Register";
import GuardianDashboard from "./pages/GuardianDashboard";
import GuardianCommunity from "./pages/GuardianCommunity";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 🎨 Only show Guardian Dashboard full-screen
  if (location.pathname === "/guardian-dashboard") {
    return (
      <Routes>
        <Route path="/guardian-dashboard" element={<GuardianDashboard />} />
      </Routes>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingBottom: "80px", // Prevent overlap with bottom nav
        overflowX: "hidden",
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
      {/* 🔘 Auth Buttons (hidden when logged in) */}
      {!currentUser && (
        <div className="auth-buttons ml-4">
          <button onClick={() => navigate('/register')} className="auth-button signup">
            Sign Up
          </button>
          <button onClick={() => navigate('/login')} className="auth-button login">
            Log In
          </button>
        </div>
      )}

      {/* ✅ Logged-in greeting + logout option */}
      {currentUser && (
        <div className="auth-buttons ml-4">
          <span className="welcome-message">👋 {currentUser.email}</span>
          <button onClick={() => auth.signOut()} className="auth-button logout">
            Log Out
          </button>
        </div>
      )}

      {/* 💖 App Routes */}
      <div style={{ paddingBottom: "100px" }}>
        <div className="routes-wrapper">
          <Routes>
            <Route path="/" element={<Friends />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/bible" element={<Bible />} />
            <Route path="/emotions" element={<EmotionPicker />} />
            <Route path="/emotion/:emotion" element={<EmotionPage />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plan" element={<PlanPlayer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/guardian-dashboard" element={<GuardianDashboard />} />
            <Route path="/guardian-community" element={<GuardianCommunity />} />
            <Route path="/plan/:id" element={<PlanPage />} />

          </Routes>
        </div>
      </div>

      {/* 📱 Bottom Nav Bar */}
      <BottomNavBar />
    </div>
  );
}

export default App;
