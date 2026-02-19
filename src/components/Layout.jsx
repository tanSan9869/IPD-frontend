import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollTop from './ui/ScrollTop.jsx';

const Layout = ({ children, showAuth = true, rightSlot = null }) => {
  return (
    <div className="app-layout theme-medical">
      <Navbar showAuth={showAuth} rightSlot={rightSlot} />
      <main className="layout-content">{children}</main>
      <Footer />
      <ScrollTop />
    </div>
  );
};

export default Layout;
