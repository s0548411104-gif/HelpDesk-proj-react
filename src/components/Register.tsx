import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../services/api.service';
import Header from './Header';
import Footer from './Footer';

interface RegisterFormProps {
    name: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormProps>();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    
    const [errorServer, setErrorServer] = useState<string | null>(null);

    if (!auth) return null;
    const { login } = auth;

    const onSubmit = async (data: RegisterFormProps) => {
        setErrorServer(null); 
        try {
            const response = await registerUser(data);
            console.log("Response from server:", response);

            if (response.token && response.user) {
                login(response.user, response.token); 
                navigate("/ticketsList");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setErrorServer("שגיאה בהרשמה. יכול להיות שהאימייל כבר קיים במערכת.");
        }
    };

    return (
        <>
            <Header />
            <div className="register-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>הרשמה למערכת 👤</h2>
                    
                    {errorServer && (
                        <div style={{ 
                            color: 'white', 
                            backgroundColor: '#ff4d4d', 
                            padding: '10px', 
                            borderRadius: '5px', 
                            marginBottom: '15px',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}>
                            {errorServer}
                        </div>
                    )}

                    <div className="form-group">
                        <label>שם מלא:</label>
                        <input {...register("name", { required: "שם הוא שדה חובה" })} />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>אימייל:</label>
                        <input type="email" {...register("email", { required: "אימייל הוא שדה חובה" })} />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>סיסמה:</label>
                        <input type="password" {...register("password", { required: "סיסמה היא שדה חובה", minLength: 6 })} />
                        {errors.password && <p style={{ color: 'red' }}>הסיסמה חייבת להיות לפחות 6 תווים</p>}
                    </div>

                    <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', cursor: 'pointer' }}>
                        הירשם והתחבר 🚀
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Register;