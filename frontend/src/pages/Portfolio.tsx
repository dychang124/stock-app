import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Container } from '@mui/material';


export default function Portfolio() {
    const [username, setUsername] = useState('');
    const [balance, setBalance] = useState(0);
    type UserStock = { stock_name: string; quantity: number; daily_change: number; price: string };
    const [userStocks, setUserStocks] = useState<UserStock[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(0);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/list/username`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsername(data.username);
        } catch (error) {
            setError('An error occurred while fetching username.');
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/list/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            setError('An error occurred while fetching balance.');
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/list/user-stocks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUserStocks(data);
        } catch (error) {
            setError('An error occurred while fetching user stocks.');
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        else {
            fetchData();
            const interval = setInterval(fetchData, 60000);
            return () => clearInterval(interval);
        }
    }, [navigate]);

    const handleSell = async (stock_name: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stocks/sell`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stock_name, quantity })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Successfully sold ${quantity} shares of ${stock_name}`);
                setSelectedStock(null);
                setQuantity(0);
                await fetchData();
            }
            else {
                setError(data.error);
            }
        } catch (error) {
            setError('An error occurred while selling stocks.');
        }
    };
    const handleAddBalance = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/list/addBalance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: 1000 })
            });

        } catch (error) {
            setError('An error occurred while adding to balance.');
        }


        fetchData();
    };
    
    

    return (
        <Container maxWidth="lg" sx={{ paddingTop: '40px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <Typography variant='h4' sx={{ textAlign: 'center' }}>Welcome, {username}</Typography>
                <Typography variant='h6' sx={{ textAlign: 'center' }}>Balance: ${Number(balance).toFixed(2)}</Typography>
                <Button variant='contained' size='small' sx={{ alignSelf: 'center' }} onClick={() => { handleAddBalance() }}>
                    Add to Balance
                </Button>
                {error && <Typography color='error'>{error}</Typography>}
                {userStocks.length > 0 ? (
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Stock</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Daily Change</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userStocks.map((stock, index) => (
                                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                    <TableCell>{stock.stock_name}</TableCell>
                                    <TableCell>{stock.quantity}</TableCell>
                                    <TableCell sx={{ color: Number(stock.daily_change) >= 0 ? 'green' : 'red' }}>{(Number(stock.daily_change) >= 0 ? '+' : '') + Number(stock.daily_change).toFixed(2)}</TableCell>
                                    <TableCell>${Number(stock.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {selectedStock === stock.stock_name ? (
                                            <Box sx={{ display: 'flex', gap: '8px' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <TextField
                                                        type="number" 
                                                        size="small"
                                                        sx={{ width: '100px' }}
                                                        value={quantity || ''}
                                                        slotProps={{ htmlInput: {min: 0}  }}
                                                        onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))} 
                                                    />
                                                    <Typography component="span">${(quantity * Number(stock.price)).toFixed(2)}</Typography>
                                                </Box>
                                                <Button variant="contained" size="small" onClick={() => handleSell(stock.stock_name)}>Confirm</Button>
                                                <Button variant="outlined" size="small" onClick={() => setSelectedStock(null)}>Cancel</Button>
                                            </Box>
                                        ) : (
                                            <Button variant="contained" color="error" size="small" onClick={() => { setSelectedStock(stock.stock_name); setQuantity(1); }}>Sell</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>
                        You don't own any stocks
                    </Typography>
                )}
            </Box>
        </Container>
    );
}