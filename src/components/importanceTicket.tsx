import React, { useEffect, useState, useContext } from 'react';
import { getPriorities, updatePriority } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';

interface Props {
    ticketId: string;
    onUpdate: () => void;
}

const ImportanceTicket: React.FC<Props> = ({ ticketId, onUpdate }) => {
    const [priorities, setPriorities] = useState<any[]>([]);
    const auth = useContext(AuthContext);
    const token = auth?.token || localStorage.getItem('token') || "";

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const data = await getPriorities(token);
                setPriorities(data);
            } catch (error) {
                console.error("שגיאה בטעינת עדיפויות:", error);
            }
        };
        if (token) fetchPriorities();
    }, [token]);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const priorityId = Number(e.target.value);
        
        if (!priorityId || !token) return;

        try {
            await updatePriority(ticketId, priorityId, token);
            
            onUpdate();
            
            console.log(`דחיפות פנייה ${ticketId} עודכנה ל-${priorityId}`);
        } catch (error) {
            console.error("שגיאה בעדכון דחיפות:", error);
        }
    };

    return (
        <div className="admin-tool-box">
            <select 
                onChange={handleChange} 
                className="admin-select"
                defaultValue=""
            >
                <option value="" disabled>שנה רמת דחיפות...</option>
                {priorities.map(p => (
                    <option key={p.id} value={p.id}>
                        {p.name === 'High' ? 'דחוף 🔥' : p.name === 'Medium' ? 'בינוני ⚡' : 'רגיל ✅'}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ImportanceTicket;