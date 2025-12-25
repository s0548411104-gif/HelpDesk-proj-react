import React, { useEffect, useState, useContext } from 'react';
import { getUsers, assignTicketToAgent } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';

interface Props {
    ticketId: string;
    onUpdate: () => void; 
}

const TicketToAgent: React.FC<Props> = ({ ticketId, onUpdate }) => {
    const [agents, setAgents] = useState<any[]>([]);
    const auth = useContext(AuthContext);
    const token = auth?.token || localStorage.getItem('token') || "";

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const allUsers = await getUsers(token);
                const onlyAgents = allUsers.filter((u: any) => u.role === 'agent' || u.role === 'admin');
                setAgents(onlyAgents);
            } catch (error) {
                console.error("שגיאה בטעינת סוכנים:", error);
            }
        };

        if (token) fetchAgents();
    }, [token, ticketId]); 

    const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const agentId = Number(e.target.value);
        if (!agentId) return;

        try {
            await assignTicketToAgent(ticketId, agentId, token);
            
            onUpdate(); 
            
            console.log(`הפנייה ${ticketId} שויכה בהצלחה לסוכן ${agentId}`);
        } catch (error) {
            console.error("שגיאה בשיוך סוכן:", error);
        }
    };

    return (
        <div className="admin-tool-box">
            <select 
                onChange={handleAssign} 
                className="admin-select"
                defaultValue="" 
            >
                <option value="" disabled>בחר סוכן לשיוך...</option>
                {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.role === 'admin' ? 'מנהל' : 'סוכן'})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TicketToAgent;