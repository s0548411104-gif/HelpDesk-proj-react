import React, { useContext } from 'react';
import { changeTicketStatus } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';

interface Props { 
    ticketId: string; 
    onUpdate: () => void; 
}

const ChangeStatus: React.FC<Props> = ({ ticketId, onUpdate }) => {
    const auth = useContext(AuthContext);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const statusId = Number(e.target.value);
        
        if (!statusId) return;

        if (auth?.token) {
            try {
                await changeTicketStatus(ticketId, statusId, auth.token);
                
                onUpdate(); 
                
                console.log(`סטטוס הפנייה ${ticketId} עודכן בהצלחה ל-${statusId}`);
            } catch (error) {
                console.error("שגיאה בעדכון הסטטוס:", error);
            }
        }
    };

    return (
        <div className="admin-tool-box">
            <select 
                onChange={handleChange} 
                className="admin-select"
                defaultValue=""
            >
                <option value="" disabled>שנה סטטוס פנייה...</option>
                <option value="1">חדש 🆕</option>
                <option value="2">בטיפול 🛠️</option>
                <option value="3">סגור ✅</option>
            </select>
        </div>
    );
};

export default ChangeStatus;