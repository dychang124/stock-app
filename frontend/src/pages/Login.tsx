import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ padding: '20px', width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Typography sx={{ textAlign: 'center' }} variant = "h4">Login</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={async () => {
                    if (!username || !password) {
                        setError('Username and password are required.');
                        return;
                    }
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
                }}>Login</Button>
                <Button variant="outlined" onClick={async () => {
                    navigate('/register');
                }}>Sign Up</Button>
            </Paper>
        </Box>
    );
}