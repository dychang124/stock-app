import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         navigate('/');
    //     }
    // }, [navigate]);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <h1 style={{ textAlign: 'center' }}>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={async () => {
                    try {
                        const response = await fetch('http://localhost:3000/auth/login', { 
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ username, password })
                        });
                        const data = await response.json();
                        if (response.ok) {
                            localStorage.setItem('token', data.token);
                            navigate('/');
                        } else {
                            setError(data.error);
                        }
                    } catch (error) {
                        setError('An error occurred while logging in.');
                    }
                }}>Login</button>
                <button onClick={async () => {
                    navigate('/register');
                }}>Sign Up</button>
            </div>
        </div>
    );
}