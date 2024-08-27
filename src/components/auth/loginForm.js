import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../loginForm.css';

import { Icon } from 'react-icons-kit';
import { user } from 'react-icons-kit/icomoon/user';
import { lock } from 'react-icons-kit/icomoon/lock';

export const IconLock = ({ size = 20 }) => <Icon icon={lock} size={size} className="iconLock" />;
export const IconUser = ({ size = 20 }) => <Icon icon={user} size={size} className="iconUser" />;


const LoginForm = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/user');
            } else {
                alert("E-posta veya parola hatalı. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error('Giriş doğrulama hatası:', error);
            alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    }

    return (
        <div className="loginFormContainer">
            <div className='wrapper'>
                <form onSubmit={(e) => handleSubmit(e)} className="register">
                    <h1>Login</h1>
                    <div className='inputBox'>
                        <IconUser />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"></input>
                    </div>
                    <div className='inputBox'>
                        <IconLock />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                    </div>
                    <button className="loginButton" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;

