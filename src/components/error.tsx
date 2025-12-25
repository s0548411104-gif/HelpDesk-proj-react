import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>אופס! הדף לא נמצא 🔍</h1>
            <p>נראה שהלכת לאיבוד בתוך מערכת הפניות.</p>
            <button onClick={() => navigate('/tickets')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                חזרה לחוף מבטחים (הפניות שלי)
            </button>
        </div>
    );
};

export default ErrorPage;