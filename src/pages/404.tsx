import React from 'react';

export default function Custom404() {
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '100px 20px',
    backgroundColor: '#1a1d2e',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif'
  };

  const linkStyle: React.CSSProperties = {
    marginTop: '20px',
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '1.2rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', maxWidth: '500px' }}>
        The music domain or news article you are looking for has been moved, 
        sold, or the database has been updated.
      </p>
      <a href="/" style={linkStyle}>
        Return to MusicWeb Home
      </a>
    </div>
  );
}
