import axios from "axios";


export const getUsers = async (token: string) => {
    const data = await axios.get("http://localhost:4000/users", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
};

export const getToken = async ({ email, password }: { email: string, password: string }) => {
    let data: any = null;
    data = await axios.post("http://localhost:4000/auth/login", {
        email,
        password
    });
    return data.data;
};
export const registerUser = async ({ name, email, password }: { name: string, email: string, password: string }) => {
    const data = await axios.post("http://localhost:4000/auth/register", {
        name,
        email,
        password,
    });
    return data.data;
};

export const getTickets = async (token: string) => {
    const data = await axios.get("http://localhost:4000/tickets", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.data;
}
export const getTicketById = async (id: string, token: string) => {
    const data = await axios.get(`http://localhost:4000/tickets/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.data;
}
export const addCommentToTicket = async (id: string, content: string, token: string) => {
    const data = await axios.post(`http://localhost:4000/tickets/${id}/comments`,
        { content: content },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    return data.data;
}
export const getComments = async (id: string, token: string) => {
    const data = await axios.get(`http://localhost:4000/tickets/${id}/comments`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.data;
}
export const getMe = async (token: string) => {
    const data = await axios.get(`http://localhost:4000/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const createTicket = async (subject: string, description: string, priority_id: number, token: string) => {
    const data = await axios.post(`http://localhost:4000/tickets`,
        { subject, description, priority_id }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const changeTicketStatus = async (id: string, status_id: number, token: string) => {
    const data = await axios.patch(`http://localhost:4000/tickets/${id}`,
        {
            status_id: status_id,
            id: id
        }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const getStatuses = async (token: string) => {
    const data = await axios.get(`http://localhost:4000/statuses`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const getPriorities = async (token: string) => {
    const data = await axios.get(`http://localhost:4000/priorities`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const updatePriority = async (id: string, priority_id: number, token: string) => {
    const data = await axios.patch(`http://localhost:4000/tickets/${id}`,
        { priority_id }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const assignTicketToAgent = async (id: string, assigned_to: number, token: string) => {
    const data = await axios.patch(`http://localhost:4000/tickets/${id}`,
        { assigned_to }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const addUser = async (name: string, email: string, password: string, role: string, token: string) => {

    const data = await axios.post(`http://localhost:4000/users`,
        { name, email, password, role }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;

}
export const deleteTicket = async (id: string, token: string) => {
    const data = await axios.delete(`http://localhost:4000/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}

export const deleteComment = async (ticketId: string, commentId: string, token: string) => {
    const data = await axios.delete(`http://localhost:4000/tickets/${ticketId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
};