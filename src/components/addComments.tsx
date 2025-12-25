import React, { useEffect, useState, useContext } from 'react';
import { getComments, addCommentToTicket } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';
import '../css/AddComments.css';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    author_name: string;
    author_email?: string;
}

interface Props {
    ticketId: string;
}

const AddComments: React.FC<Props> = ({ ticketId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSending, setIsSending] = useState(false);

    const auth = useContext(AuthContext);
    const token = auth?.token || localStorage.getItem('token') || "";

    const loadComments = async () => {
        if (ticketId && token) {
            try {
                const data = await getComments(ticketId, token);
                setComments(data);
            } catch (error) {
                console.error("שגיאה בטעינת תגובות:", error);
            }
        }
    };

    useEffect(() => {
        loadComments();
    }, [ticketId, token]);

    const handleSendComment = async () => {
        if (!newComment.trim() || isSending) return;

        setIsSending(true);
        try {
            await addCommentToTicket(ticketId, newComment, token);
            setNewComment(""); 
            await loadComments(); 
        } catch (error) {
            console.error("שגיאה בשליחת התגובה:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="comments-section">
            <h3>תגובות ועדכונים 💬</h3>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>אין עדיין תגובות לפנייה זו.</p>
                ) : (
                    comments.map(c => (
                        <div key={c.id}>
                            <div>
                                <strong >
                                    👤 {c.author_name || "משתמש"}
                                </strong>
                                <small>
                                    {new Date(c.created_at).toLocaleString('he-IL')}
                                </small>
                            </div>
                            <p >{c.content}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="comment-input-area" >
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="כתבי תגובה חדשה או עדכון..."
                    rows={3}
                />
                <button
                    onClick={handleSendComment}
                    disabled={isSending}
                >
                    {isSending ? "שולח..." : "שלח עדכון 🚀"}
                </button>
            </div>
        </div>
    );
};


export default AddComments;