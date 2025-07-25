import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import UsernameForm from "./UsernameForm";
const socket = io("http://localhost:3000");


const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  // Matrix animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Matrix letters
    const letters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(17,17,17,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + "px Fira Mono, Consolas, Courier New, monospace";
      ctx.fillStyle = "#00ff41";
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!registered) return;
    socket.on("chat history", (history) => {
      setMessages(history);
    });
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("chat history");
      socket.off("chat message");
    };
  }, [registered]);

  // Handle username registration
  const handleSetUsername = (name) => {
    socket.emit("register username", name, (response) => {
      if (response.success) {
        setUsername(name);
        setRegistered(true);
        setError("");
      } else {
        setError(response.error || "Username error");
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username.trim()) {
      socket.emit("chat message", { username, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-bg">
      <canvas ref={canvasRef} className="matrix-bg"></canvas>
      <div className="chat-container">
        <h2 className="chat-title">NeoChat</h2>
        {!registered ? (
          <>
            <UsernameForm onSetUsername={handleSetUsername} />
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
          </>
        ) : (
          <>
            <div style={{ color: '#00ff41', marginBottom: 8, fontSize: '1rem', textAlign: 'center' }}>
              Welcome, <span style={{ fontWeight: 'bold' }}>{username}</span>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="chat-message">
                    <span style={{ color: '#00ff41', fontWeight: 'bold' }}>{msg.username || 'Anonymous'}:</span> {msg.message}
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className="chat-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
                autoFocus
              />
              <button type="submit" className="chat-send">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App