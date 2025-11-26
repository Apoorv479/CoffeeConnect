// client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      textAlign: 'center', 
      padding: '5px 0',       
      background: '#f8f9fa', 
      fontSize: '0.7rem',    
      borderTop: '1px solid #e9ecef',
      flexShrink: 0           
    }}>
      <p>© {new Date().getFullYear()} CafeFinder. Data © OpenStreetMap contributors.</p>
    </footer>
  );
};

export default Footer;