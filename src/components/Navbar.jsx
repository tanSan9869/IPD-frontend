import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ showAuth = true, rightSlot = null }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`.trim()}>
      <div className="logo-container" onClick={() => navigate('/') } style={{cursor:'pointer'}}>
        <img src="/smartcare-logo.png" alt="SmartHealth Connect Logo" className="logo" />
        <span className="logo-text">SmartCare</span>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className="nav-buttons">
        {rightSlot}
        {showAuth && (
          <>
            <button id="btn" className="nav-login-btn" onClick={() => navigate('/role-selection')}>
              Login
            </button>
            <button id="btn1" className="nav-signup-btn" onClick={() => navigate('/role-selection')}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
