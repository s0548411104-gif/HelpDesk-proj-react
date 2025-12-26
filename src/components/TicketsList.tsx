import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTickets } from '../services/api.service';
import '../css/TicketsList.css';

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status_id: number;
    priority_id: number;
    priority_name: string;
    created_by: number;
    assigned_to: number | null;
    status_name: string;
    created_at: string;
    creator_name?: string;
}

const TicketsList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const token = localStorage.getItem('token') || auth?.token;

    const fetchTickets = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const data = await getTickets(token);
            setTickets(data);
        } catch (error) {
            console.error("שגיאה בטעינת הרשימה:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets, location.key]);

    const filteredTickets = useMemo(() => {
        return tickets
            .filter(ticket => {
                const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
                
                const isClosed = Number(ticket.status_id) === 2;
                const matchesStatus = 
                    statusFilter === 'all' ? true :
                    statusFilter === 'closed' ? isClosed : !isClosed;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => b.id - a.id);
    }, [tickets, searchTerm, statusFilter]);

    if (loading) return <div className="tickets-container"><p>טוען נתונים... ⏳</p></div>;

    return (
        <div className="tickets-container">
            <h2 className="main-title">ניהול פניות שירות 🎫</h2>

            <div className="filter-controls">
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="חיפוש לפי נושא פנייה..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-box">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">כל המצבים</option>
                        <option value="open">פתוח בלבד 📨</option>
                        <option value="closed">סגור בלבד ✅</option>
                    </select>
                </div>

                <div className="results-count">
                    נמצאו <strong>{filteredTickets.length}</strong> פניות
                </div>
            </div>

            <div className="tickets-grid">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                        const isClosed = Number(ticket.status_id) === 2;
                        return (
                            <div 
                                key={ticket.id} 
                                className={`ticket-card ${isClosed ? 'status-is-closed' : 'status-is-open'}`} 
                                onClick={() => navigate(`/ticket/${ticket.id}`)}
                            >
                                <div className="card-header">
                                    <span className="ticket-id">#{ticket.id}</span>
                                    <div className="header-badges">
                                        <span className={`status-badge-text ${isClosed ? 'badge-closed' : 'badge-open'}`}>
                                            {isClosed ? "CLOSED ✅" : "OPEN 📨"}
                                        </span>
                                        <span className={`priority-badge p-${ticket.priority_id}`}>
                                            {ticket.priority_name}
                                        </span>
                                    </div>
                                </div>

                                <h3>{ticket.subject}</h3>
                                
                                <div className="ticket-meta-info">
                                    <div>👤 יוצר: {ticket.creator_name || `משתמש (${ticket.created_by})`}</div>
                                    <div>📅 תאריך: {new Date(ticket.created_at).toLocaleDateString('he-IL')}</div>
                                </div>

                                <div className="ticket-footer">
                                    <span className={`status-tag ${isClosed ? 'tag-closed' : 'tag-open'}`}>
                                        מצב: {isClosed ? 'סגור' : 'פתוח'}
                                    </span>
                                    {(user?.role === 'agent' || user?.role === 'admin') && (
                                        <span className="manage-link">ניהול פנייה ⚙️</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-results-msg">לא נמצאו פניות מתאימות לחיפוש שלך. 🔍</div>
                )}
            </div>
        </div>
    );
};

export default TicketsList;