import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, MenuItem, Menu } from '@mui/material';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const notSignedIn = location.pathname === '/login' || location.pathname === '/register'

    return (
        <AppBar position="static" elevation={0} sx={{ width: '100%' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Stock Trading App
                </Typography>
                {!notSignedIn && (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/')}>
                            My Portfolio
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/stocks')}>
                            Buy Stocks
                        </Button>
                        <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                            👤
                        </Button>
                            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                                <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>Edit Profile</MenuItem>
                                <MenuItem onClick={() => { localStorage.removeItem('token'); navigate('/login'); setAnchorEl(null); }}>Logout</MenuItem>
                            </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}