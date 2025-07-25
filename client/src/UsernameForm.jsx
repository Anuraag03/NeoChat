import React, { useState } from 'react';

const UsernameForm = ({ onSetUsername }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSetUsername(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <label htmlFor="username" style={{ color: '#00ff41', fontSize: '1.1rem' }}>Enter your username:</label>
      <input
        id="username"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{
          padding: '10px 14px',
          borderRadius: 4,
          border: '1px solid #00ff41',
          background: '#181c20',
          color: '#00ff41',
          fontFamily: 'inherit',
          fontSize: '1rem',
          outline: 'none',
        }}
        placeholder="Username"
        autoFocus
      />
      <button type="submit" style={{
        padding: '10px 22px',
        borderRadius: 4,
        border: '1px solid #00ff41',
        background: '#111',
        color: '#00ff41',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: 'none',
        transition: 'background 0.2s, color 0.2s',
      }}>Join Chat</button>
    </form>
  );
};

export default UsernameForm;
