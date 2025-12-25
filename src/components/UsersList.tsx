import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';
import '../css/UsersList.css';

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const token = auth?.token || localStorage.getItem('token') || "";

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(token);
                setUsers(data);
            } catch (error) {
                console.error("שגיאה בטעינת משתמשים:", error);
            }
        };
        if (token) fetchUsers();
    }, [token]);

    return (
        <div className="users-list-container">
            <div className="users-header">
                <h2>רשימת משתמשים במערכת 👥</h2>
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    חזרה לדאשבורד
                </button>
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>שם מלא</th>
                        <th>אימייל</th>
                        <th>תפקיד</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name || user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`role-badge role-${user.role}`}>
                                    {user.role}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;