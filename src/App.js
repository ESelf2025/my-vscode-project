// App.js
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./pages/Firebase";

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

  // All other normal pages (daughter layout)
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
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
      {/* Nav Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          background: "linear-gradient(90deg, #ffc1cc, #e1bee7, #ffccf9)",
          padding: "12px 24px",
          borderRadius: "32px",
          boxShadow: "0 6px 16px rgba(255, 182, 193, 0.5)",
          marginBottom: "40px",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {[
          { path: "/", label: "Friends" },
          { path: "/Watch", label: "Watch" },
          { path: "/journal", label: "Journal" },
          { path: "/bible", label: "Bible" },
          { path: "/profile", label: "Profile" },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              padding: "10px 18px",
              borderRadius: "20px",
              backgroundColor: location.pathname === path ? "#ffffffaa" : "transparent",
              boxShadow:
                location.pathname === path
                  ? "0 0 10px rgba(255, 255, 255, 0.6), inset 0 0 5px #fff"
                  : "none",
              color: "#6a1b9a",
              fontWeight: "bold",
              fontSize: "16px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            {label}
          </Link>
        ))}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            display: "flex",
            gap: "10px",
          }}
        >
          {!currentUser ? (
            <>
              <button
                onClick={() => navigate("/register")}
                style={buttonStyle("#d0a1f3")}
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                style={buttonStyle("#ffb3d9")}
              >
                Log In
              </button>
            </>
          ) : (
            <>
              <span style={{ fontWeight: "bold", color: "#6a1b9a" }}>
                👋 Welcome, {currentUser.email}!
              </span>
              <button
                onClick={() => auth.signOut()}
                style={buttonStyle("#ff8379")}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
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
  );
}

export default App;
