import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../css/login.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // משתני מצב להודעות
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const nav = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // איפוס הודעות
    try {
      const response = await axios.post("http://localhost:4000/auth/login", { email, password });
      if (auth) auth.login(response.data.user, response.data.token);
      nav("/tickets");
    } catch (error) {
      setMessage({ text: "שגיאה בהתחברות. וודא שהפרטים נכונים", isError: true });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // איפוס הודעות
    try {
      const response = await axios.post("http://localhost:4000/auth/register", { name, email, password });
      if (auth) auth.login(response.data.user, response.data.token);

      // במקום אלרט, נציג הודעה ונמתין רגע לפני מעבר דף
      setMessage({ text: "נרשמת בהצלחה! 🥳", isError: false });
      setTimeout(() => nav("/tickets"), 1500);
    } catch (error) {
      setMessage({ text: "שגיאה בהרשמה. ייתכן שהאימייל כבר קיים", isError: true });
    }
  };

  return (
    <div className="login-page">
      <div className="status-bar">
        <span>הנך משתמש בלתי מחובר</span>
        <div className="status-dot"></div>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="tabs-container">
            <button
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setMessage(null); }}
            >
              הרשמה
            </button>
            <button
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setMessage(null); }}
            >
              התחברות
            </button>
          </div>

          <div className="login-header">
            <h1>{isLogin ? 'כניסה ל - helpDesk' : 'הרשמה ל - helpDesk'}</h1>
            <p>ברוכים הבאים</p>
          </div>

          {message && (
            <div className={`message-box ${message.isError ? 'error' : 'success'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div className="input-group">
                <label>👤 שם מלא:</label>
                <input type="text" placeholder="הכנס שם מלא" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="input-group">
              <label>📧 אימייל:</label>
              <input type="email" placeholder="הכנס אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>🔒 סיסמה:</label>
              <input type="password" placeholder="הכנס סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="submit-btn">{isLogin ? 'כניסה' : 'הרשם עכשיו'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;