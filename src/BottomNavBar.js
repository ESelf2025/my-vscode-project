import React from 'react';
import { Link } from 'react-router-dom';

const BottomNavBar = () => {
  return (
    <div style={styles.navBar}>
      <Link to="/" style={styles.icon}>🏠</Link>
      <Link to="/watch" style={styles.icon}>🎬</Link>
      <Link to="/bible" style={styles.icon}>📖</Link>
      <Link to="/journal" style={styles.icon}>📓</Link>
      <Link to="/profile" style={styles.icon}>👤</Link>
    </div>
  );
};

const styles = {
  navBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fceaff',
    borderTop: '2px solid #ffcfff',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    zIndex: 1000,
  },
  icon: {
    fontSize: '24px',
    textDecoration: 'none',
  }
};

export default BottomNavBar;
