import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ padding: '20px', width: '300px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'lightgrey' }}>
                <Typography sx={{ textAlign: 'center' }} variant = "h4">Login</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField sx={{ backgroundColor: 'white' }}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField sx={{ backgroundColor: 'white' }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={async () => {
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
                }}>Login</Button>
                <Button sx={{ backgroundColor: 'white' }} variant="outlined" onClick={async () => {
                    navigate('/register');
                }}>Sign Up</Button>
            </Paper>
        </Box>
    );
}