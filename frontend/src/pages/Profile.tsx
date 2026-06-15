import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';

export default function Profile() {
    const [new_username, setNewUsername] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (!new_username && !new_password) {
            setError('Please enter a new username or password');
            return;
        }
        else if (new_username){
            try {
                const response = await fetch('http://localhost:3000/auth/set-username', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ new_username })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Username updated successfully');
                    setError('');
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError('An error occurred while updating username.'); 
            }
        }
        else if (new_password){
            try {
                const response = await fetch('http://localhost:3000/auth/set-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ new_password })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Password updated successfully');
                    setError('');
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError('An error occurred while updating password.'); 
            }
        }
        setNewPassword('');
        setNewUsername('');
    }; 
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', padding: '20px', backgroundColor: 'lightgrey' }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }}>Profile</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField sx={{ backgroundColor: 'white' }}
                    label="Username"
                    value={new_username}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <TextField sx={{ backgroundColor: 'white' }}
                    label="Password"
                    type="password"
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    Update Profile
                </Button>
            </Paper>
        </Box>
    );
}