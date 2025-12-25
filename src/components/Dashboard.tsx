import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets, getUsers } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';
import '../css/Dashboard.css';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ totalTickets: 0, openTickets: 0, totalUsers: 0 });
    const auth = useContext(AuthContext);
    const navigate = useNavigate(); 
    const token = auth?.token || "";

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tickets, users] = await Promise.all([
                    getTickets(token),
                    getUsers(token)
                ]);
                
                setStats({
                    totalTickets: tickets.length,
                    openTickets: tickets.filter((t: any) => t.status_id !== 3).length,
                    totalUsers: users.length
                });
            } catch (error) {
                console.error("שגיאה בטעינת נתונים ללוח הבקרה:", error);
            }
        };

        if (token) fetchStats();
    }, [token]);

    return (
        <div className="dashboard-container">
            <div>
                <h1>לוח בקרה למנהל 📊</h1>
                <button 
                    onClick={() => navigate('/tickets')} 
                >
                    🔙 חזרה לכל הפניות
                </button>
            </div>
            
            <div className="stats-grid" >
                <div 
                    className="stat-card clickable-card" 
                    onClick={() => navigate('/tickets')}
                >
                    <h3>סה"כ פניות</h3>
                    <p>{stats.totalTickets}</p>
                    <span>לחץ לצפייה ←</span>
                </div>

                <div 
                    className="stat-card clickable-card" 
                    onClick={() => navigate('/tickets?filter=open')}
                >
                    <h3>פניות פתוחות</h3>
                    <p>{stats.openTickets}</p>
                    <span>לחץ לטיפול ←</span>
                </div>

                <div 
                    className="stat-card clickable-card" 
                    onClick={() => navigate('/users')}
                >
                    <h3>משתמשים במערכת</h3>
                    <p>{stats.totalUsers}</p>
                    <span>לחץ לניהול ←</span>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;