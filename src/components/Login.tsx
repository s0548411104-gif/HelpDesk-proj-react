import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { registerUser, getToken } from '../services/api.service';
import '../css/login.css';

interface AuthFormInputs {
    name?: string;
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [serverMessage, setServerMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormInputs>();

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setServerMessage(null);
        reset();
    };

    const onSubmit = async (data: AuthFormInputs) => {
        setServerMessage(null);
        setIsLoading(true);

        try {
            if (!isLoginMode) {
                await registerUser({ 
                    name: data.name || '', 
                    email: data.email, 
                    password: data.password 
                });
            }

            const response = await getToken({ 
                email: data.email, 
                password: data.password 
            });

            if (auth && response.token && response.user) {
                auth.login(response.user, response.token);
                setServerMessage({ text: isLoginMode ? "התחברת בהצלחה!" : "נרשמת והתחברת בהצלחה! 🥳", isError: false });
                
                setTimeout(() => navigate("/tickets"), 1200);
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            const errorMsg = isLoginMode 
                ? "שגיאה בהתחברות. וודא שהפרטים נכונים" 
                : "שגיאה בהרשמה. ייתכן שהאימייל כבר קיים במערכת";
            setServerMessage({ text: errorMsg, isError: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="status-bar">
                <span>מצב מערכת: {auth?.user ? `מחובר כ-${auth.user.name}` : 'בלתי מחובר'}</span>
                <div className={`status-dot ${auth?.user ? 'online' : ''}`}></div>
            </div>

            <div className="login-card-container">
                <div className="login-card">
                    <div className="tabs-container">
                        <button
                            type="button"
                            className={`tab-btn ${!isLoginMode ? 'active' : ''}`}
                            onClick={toggleMode}
                        >
                            הרשמה
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${isLoginMode ? 'active' : ''}`}
                            onClick={toggleMode}
                        >
                            התחברות
                        </button>
                    </div>

                    <div className="login-header">
                        <h1>{isLoginMode ? 'כניסה ל - helpDesk' : 'הרשמה ל - helpDesk'}</h1>
                        <p>ברוכים הבאים למערכת ניהול הקריאות</p>
                    </div>

                    {serverMessage && (
                        <div className={`message-box ${serverMessage.isError ? 'error' : 'success'}`}>
                            {serverMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {!isLoginMode && (
                            <div className="input-group">
                                <label>👤 שם מלא:</label>
                                <input 
                                    type="text" 
                                    placeholder="הכנס שם מלא" 
                                    {...register("name", { required: !isLoginMode ? "שם הוא שדה חובה" : false })} 
                                />
                                {errors.name && <span className="error-text">{errors.name.message}</span>}
                            </div>
                        )}

                        <div className="input-group">
                            <label>📧 אימייל:</label>
                            <input 
                                type="email" 
                                placeholder="example@email.com" 
                                {...register("email", { 
                                    required: "אימייל הוא שדה חובה",
                                    pattern: { value: /^\S+@\S+$/i, message: "אימייל לא תקין" }
                                })} 
                            />
                            {errors.email && <span className="error-text">{errors.email.message}</span>}
                        </div>

                        <div className="input-group">
                            <label>🔒 סיסמה:</label>
                            <input 
                                type="password" 
                                placeholder="הכנס סיסמה" 
                                {...register("password", { 
                                    required: "סיסמה היא שדה חובה",
                                    minLength: { value: 6, message: "מינימום 6 תווים" }
                                })} 
                            />
                            {errors.password && <span className="error-text">{errors.password.message}</span>}
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={isLoading}
                        >
                            {isLoading ? "מעבד נתונים... ⏳" : (isLoginMode ? 'כניסה' : 'הרשם עכשיו')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;