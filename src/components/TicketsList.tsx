import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTickets, createTicket, changeTicketStatus } from '../services/api.service';
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
}

const TicketsList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [subject, setSubject] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [priorityId, setPriorityId] = useState<number>(1);
    const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const token = localStorage.getItem('token') || auth?.token;

    const fetchTickets = async () => {
        try {
            if (!token) {
                setLoading(false);
                return;
            }
            const data = await getTickets(token);
            setTickets(data);
            setLoading(false);
        } catch (error) {
            console.error("שגיאה בטעינת הפניות:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [token]);

    const handleQuickStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, ticketId: number) => {
        e.stopPropagation(); 
        const newStatusId = Number(e.target.value);

        const statusNames: { [key: number]: string } = {
            1: 'open',
            2: 'in_progress',
            3: 'closed',
            4: 'deleted' 
        };

        try {
            if (token) {
                await changeTicketStatus(ticketId.toString(), newStatusId, token);

                setTickets(prev => prev.map(t =>
                    t.id === ticketId ? { 
                        ...t, 
                        status_id: newStatusId, 
                        status_name: statusNames[newStatusId] 
                    } : t
                ));
                
                setFormStatus({ message: "הסטטוס עודכן! ✅", type: 'success' });
                setTimeout(() => setFormStatus({ message: '', type: null }), 2000);
            }
        } catch (error) {
            setFormStatus({ message: "עדכון נכשל ❌", type: 'error' });
        }
    };

    const processedTickets = useMemo(() => {
        let filtered = tickets.filter(ticket => {
            if (ticket.status_id === 4) return false;

            if (user?.role === 'admin') return true;
            if (user?.role === 'agent') return ticket.assigned_to === user.id;
            if (user?.role === 'customer') return ticket.created_by === user.id;
            return false;
        });

        if (filterStatus !== "all") {
            filtered = filtered.filter(t =>
                t.status_name?.toLowerCase().trim() === filterStatus.toLowerCase().trim()
            );
        }

        // סינון לפי דחיפות
        if (filterPriority !== "all") {
            filtered = filtered.filter(t =>
                t.priority_name?.toLowerCase().trim() === filterPriority.toLowerCase().trim()
            );
        }

        // חיפוש חופשי
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // מיון
        return [...filtered].sort((a, b) => {
            if (sortBy === "newest") return b.id - a.id;
            if (sortBy === "oldest") return a.id - b.id;
            if (sortBy === "priority") return b.priority_id - a.priority_id;
            return 0;
        });
    }, [tickets, user, filterStatus, filterPriority, sortBy, searchTerm]);

    const handleAddTicket = async () => {
        if (!subject || !description) {
            setFormStatus({ message: "נא למלא נושא ותיאור ⚠️", type: 'error' });
            return;
        }
        try {
            if (token) {
                await createTicket(subject, description, priorityId, token);
                setFormStatus({ message: "הפנייה נוספה בהצלחה! ✅", type: 'success' });
                await fetchTickets();
                setSubject(""); setDescription(""); setPriorityId(1);
                setTimeout(() => setFormStatus({ message: '', type: null }), 3000);
            }
        } catch (error) {
            setFormStatus({ message: "הפעולה נכשלה ❌", type: 'error' });
        }
    };

    if (loading) return <div className="tickets-container"><p>טוען נתונים... ⏳</p></div>;

    return (
        <div className="tickets-container">
            <h2 className="main-title">ניהול פניות שירות 🎫</h2>

            {user?.role === 'customer' && (
                <div className="form-section card">
                    <h3>הוספת פנייה חדשה 📝</h3>
                    {formStatus.type && <div className={`status-message ${formStatus.type}`}>{formStatus.message}</div>}
                    <div className="input-group">
                        <input className="form-input" placeholder="נושא הפנייה" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        <textarea className="form-input" placeholder="תיאור הבעיה..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                        <div className="form-row">
                            <select className="form-input" value={priorityId} onChange={(e) => setPriorityId(Number(e.target.value))}>
                                <option value={1}>רגיל</option>
                                <option value={2}>בינוני</option>
                                <option value={3}>דחוף 🔥</option>
                            </select>
                            <button className="submit-button" onClick={handleAddTicket}>שלח פנייה 🚀</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="filter-sort-bar card">
                <div className="search-box">
                    <input type="text" placeholder="חיפוש חופשי..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="select-group">
                    <label>סטטוס:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">הכל</option>
                        <option value="open">פתוח</option>
                        <option value="in_progress">בטיפול</option>
                        <option value="closed">סגור</option>
                    </select>
                </div>

                <div className="select-group">
                    <label>דחיפות:</label>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <option value="all">כל הרמות</option>
                        <option value="low">רגיל</option>
                        <option value="medium">בינוני ⚡</option>
                        <option value="high">דחוף 🔥</option>
                    </select>
                </div>

                <div className="select-group">
                    <label>מיין:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">חדש ביותר</option>
                        <option value="oldest">ישן ביותר</option>
                        <option value="priority">לפי דחיפות</option>
                    </select>
                </div>
            </div>

            <div className="tickets-grid">
                {processedTickets.length > 0 ? (
                    processedTickets.map((ticket) => (
                        <div key={ticket.id} className={`ticket-card priority-${ticket.priority_id}`} onClick={() => navigate(`/ticket/${ticket.id}`)}>
                            <div className="card-header">
                                <span className="ticket-id">#{ticket.id}</span>
                                <span className={`priority-badge p-${ticket.priority_id}`}>
                                    {ticket.priority_id === 3 ? "דחוף 🔥" : ticket.priority_id === 2 ? "בינוני ⚡" : "רגיל"}
                                </span>
                            </div>
                            <h3>{ticket.subject} 📌</h3>
                            <div className="ticket-footer">
                                {(user?.role === 'agent' || user?.role === 'admin') ? (
                                    <div className="status-update-container" onClick={(e) => e.stopPropagation()}>
                                        <label>סטטוס:</label>
                                        <select
                                            className="quick-status-select"
                                            value={ticket.status_id}
                                            onChange={(e) => handleQuickStatusChange(e, ticket.id)}
                                        >
                                            <option value={1}>Open</option>
                                            <option value={2}>In Progress</option>
                                            <option value={3}>Closed</option>
                                        </select>
                                    </div>
                                ) : (
                                    <span className="status-badge">סטטוס: {ticket.status_name}</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>לא נמצאו פניות התואמות את הסינון שלך. 🔍</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsList;