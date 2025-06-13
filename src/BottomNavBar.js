import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaVideo, FaBible, FaBookOpen, FaUser } from 'react-icons/fa';

const BottomNavBar = () => {
  return (
    <div style={styles.navBar}>
      <Link to="/" style={styles.icon}><FaHome /></Link>
      <Link to="/watch" style={styles.icon}><FaVideo /></Link>
      <Link to="/journal" style={styles.icon}><FaBookOpen /></Link>
      <Link to="/bible" style={styles.icon}><FaBible /></Link>
      <Link to="/profile" style={styles.icon}><FaUser /></Link>
    </div>
  );
};

const styles = {
  navBar: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    background: 'linear-gradient(to right, #fdb7c0, #e0b6f9)', // gradient!
    borderRadius: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '18px 0',
    zIndex: 1000,
  },
  icon: {
    fontSize: '26px',
    color: '#b94ec2', // matches your app's purple-pink tones
    textDecoration: 'none',
  }
};

export default BottomNavBar;
