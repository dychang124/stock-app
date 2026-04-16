import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    
    const notSignedIn = location.pathname === '/login' || location.pathname === '/register'

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
            <h1 style={{ margin: 0 }}>Stock Trading App</h1>
            {!notSignedIn && (
                <div>
                    <button onClick={() => navigate('/')}>My Portfolio</button>
                    <button onClick={() => navigate('/stocks')}>Buy Stocks</button>
                    <button onClick={() => setShowDropdown(!showDropdown)}>👤</button>
                    {showDropdown && (
                        <div style={{ position: 'absolute', top: '50px', right: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                <li style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => { navigate('/profile'); setShowDropdown(false); }}>Edit Profile</li>
                                <li style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => { localStorage.removeItem('token'); navigate('/login'); setShowDropdown(false); }}>Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}