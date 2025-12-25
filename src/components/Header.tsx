import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../css/header.css';

const Header = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null;

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="header-container">
      <div className="logo">
        HelpDesk System 📟
      </div>

      <div className="user-info">
        {auth.user ? (
          <>
            <span>שלום, <strong>{auth.user.name}</strong></span>
            <span className="role-badge">{auth.user.role}</span>
            <button className="logout-btn" onClick={handleLogout}>התנתק 🚪</button>
            {auth.user.role === 'admin' && (
              <>
                <Link to="/dashboard">📊 דאשבורד</Link>
                <Link to="/add-user">
                  ➕ הוספת משתמש
                </Link>
              </>
            )}
          </>
        ) : (
          <button className="logout-btn" onClick={() => navigate("/login")}>
            התחבר 🔑
          </button>
        )}
      </div>
    </header>
  );
};
export default Header;