import React, { useContext, useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import { addUser } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';
import '../css/AddUser.css';

interface AddUserForm {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'agent' | 'admin';
}

const AddUser: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUserForm>();
    const navigate = useNavigate(); 
    const auth = useContext(AuthContext);
    const token = auth?.token || localStorage.getItem('token') || "";

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: AddUserForm) => {
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            await addUser(data.name, data.email, data.password, data.role, token);
            setSuccessMessage(`המשתמש ${data.name} נוסף בהצלחה למערכת! 🎉`);
            reset();
        } catch (error) {
            console.error("שגיאה בהוספת משתמש:", error);
            setErrorMessage("הפעולה נכשלה. וודא שיש לך הרשאות מנהל ושהאימייל לא קיים כבר.");
        }
    };

    return (
        <div className="add-user-container">
            <div>
                <h2>הוספת משתמש חדש 👤</h2>
                <button 
                    onClick={() => navigate('/tickets')} 
                >
                    🔙 חזרה לפניות
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {successMessage && <div style={{ color: 'green', marginBottom: '10px', fontWeight: 'bold' }}>{successMessage}</div>}
                
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>{errorMessage}</div>}

                <label>שם מלא:</label>
                <input {...register("name", { required: "שם הוא שדה חובה" })} />
                {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}

                <label>אימייל:</label>
                <input type="email" {...register("email", { required: "אימייל הוא שדה חובה" })} />
                {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

                <label>סיסמה:</label>
                <input type="password" {...register("password", { required: "סיסמה היא שדה חובה", minLength: 6 })} />
                {errors.password && <span style={{ color: 'red' }}>מינימום 6 תווים</span>}

                <label>תפקיד במערכת:</label>
                <select {...register("role", { required: true })}>
                    <option value="customer">לקוח (Customer)</option>
                    <option value="agent">סוכן (Agent)</option>
                    <option value="admin">מנהל (Admin)</option>
                </select>

                <button type="submit">
                    צור משתמש חדש ✨
                </button>
            </form>
        </div>
    );
};

export default AddUser;