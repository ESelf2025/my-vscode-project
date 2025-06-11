// App.js
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const buttonStyle = (bgColor) => ({
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: bgColor,
  });

  // Render Guardian Dashboard separately
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
      paddingBottom: "80px", // Added padding to prevent content from being covered by the bottom nav
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
  
      {/* Top Nav - hidden on mobile */}
      <nav className="navbar hidden md:flex justify-center gap-4 mb-4">
        {[
          { path: '/', label: 'Friends' },
          { path: '/Watch', label: 'Watch' },
          { path: '/journal', label: 'Journal' },
          { path: '/bible', label: 'Bible' },
          { path: '/profile', label: 'Profile' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}

        {/* Auth buttons (desktop only) */}
        <div className="auth-buttons ml-4">
          {!currentUser ? (
            <>
              <button onClick={() => navigate('/register')} className="auth-button signup">
                Sign Up
              </button>
              <button onClick={() => navigate('/login')} className="auth-button login">
                Log In
              </button>
            </>
          ) : (
            <>
              <span className="welcome-message">👋 {currentUser.email}</span>
              <button onClick={() => auth.signOut()} className="auth-button logout">
                Log Out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Ensure the bottom navigation is always visible */}
      <div style={{ paddingBottom: "100px" }}> {/* Added padding to prevent content from overlapping the bottom nav */}
        {/* Routes */}
        <div className="routes-wrapper">
          <Routes>
            <Route path="/" element={<Friends />} />
            <Route path="/Watch" element={<Watch />} />
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

          </Routes>
        </div>
      </div>

      {/* 📱 IG-style Bottom Nav — FIXED FOR REAL */}
<BottomNavBar />
      </div>
  );
}

export default App;
