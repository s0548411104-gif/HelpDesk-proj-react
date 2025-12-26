import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, deleteTicket, getComments, deleteComment } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';
import TicketToAgent from './ticketToAgent';
import ImportanceTicket from './importanceTicket';
import ChangeStatus from './ChangeStatus';
import AddComments from './addComments';
import '../css/TicketDetails.css';

const TicketDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<any>(null);
    const [deleteStatus, setDeleteStatus] = useState<{ text: string; isError: boolean } | null>(null);
    
    const auth = useContext(AuthContext);
    const user = auth?.user; 
    const token = auth?.token || localStorage.getItem('token');

    const loadTicket = async () => {
        if (id && token) {
            try {
                const data = await getTicketById(id, token);
                setTicket(Array.isArray(data) ? data[0] : data);
            } catch (error) {
                console.error("שגיאה בטעינה:", error);
            }
        }
    };

    useEffect(() => {
        loadTicket();
    }, [id, token]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("אזהרה: מחיקת הפנייה תמחוק לצמיתות גם את כל התגובות הקשורות אליה. להמשיך?");
        if (confirmDelete && id && token) {
            setDeleteStatus({ text: "מוחק נתונים... ⏳", isError: false });
            try {
                const comments = await getComments(id, token);
                if (comments && comments.length > 0) {
                    for (const comment of comments) {
                        try {
                            await deleteComment(id, comment.id.toString(), token);
                        } catch (err) {
                            console.warn(`לא הצלחתי למחוק תגובה ${comment.id}`);
                        }
                    }
                }
                await deleteTicket(id, token);
                setDeleteStatus({ text: "הפנייה נמחקה בהצלחה! מעביר לרשימה...", isError: false });
                setTimeout(() => navigate("/tickets"), 1500); 
            } catch (error: any) {
                console.error("שגיאה בתהליך המחיקה:", error);
                setDeleteStatus({ text: "המחיקה נכשלה.", isError: true });
            }
        }
    };

    if (!ticket) return <div>טוען פרטי פנייה... ⏳</div>;

    return (
        <div className="ticket-details-page">
            <div className="ticket-header">
                <h2>פרטי פנייה מס' {id} 🎫</h2>
                <button onClick={() => navigate('/tickets')}>חזרה לרשימה</button>
            </div>
            
            <div className="info-card">
                <h3>נושא: {ticket.subject}</h3>
                <p><b>תיאור:</b> {ticket.description}</p>
                <div>
                    <p><b>סטטוס:</b> <span className="status-badge">{ticket.status_name}</span></p>
                    <p><b>דחיפות:</b> <span className="priority-badge">{ticket.priority_name}</span></p>
                    <p><b>סוכן מטפל:</b> {ticket.assigned_to_name || "טרם שויך"}</p>
                </div>
            </div>

            {(user?.role === 'admin' || user?.role === 'agent') && (
                <div className="admin-tools">
                    <h4>ניהול פנייה ⚙️</h4>
                    
                    <div className="tool">
                        <p>שינוי סטטוס</p>
                        <ChangeStatus ticketId={id!} onUpdate={loadTicket} />
                    </div>

                    {user?.role === 'admin' && (
                        <>
                            <div className="tool">
                                <p>שיוך לסוכן</p>
                                <TicketToAgent ticketId={id!} onUpdate={loadTicket} />
                            </div>

                            <div className="tool">
                                <p>שינוי דחיפות</p>
                                <ImportanceTicket ticketId={id!} onUpdate={loadTicket} />
                            </div>
                        </>
                    )}
                </div>
            )}

            {user?.role === 'admin' && (
                <div className="danger-zone">
                    {deleteStatus && (
                        <div className={deleteStatus.isError ? "error" : "success"}>
                            {deleteStatus.text}
                        </div>
                    )}
                    <button className="delete-button-red" onClick={handleDelete}>
                        🗑️ מחיקת פנייה לצמיתות
                    </button>
                </div>
            )}

            <hr />
            <AddComments ticketId={id!} />
        </div>
    );
};

export default TicketDetails;