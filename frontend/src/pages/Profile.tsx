import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [new_username, setNewUsername] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <h1 style={{ textAlign: 'center' }}>Profile</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={new_username}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>Update Profile</button>
            </div>
        </div>
    );
}