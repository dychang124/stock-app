import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Container } from '@mui/material';

export default function Stocks() {
    type stock = { stock_name: string; daily_change: number; price: string; sentiment: string };
    const [stocks, setStocks] = useState<stock[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(0);

    const handleBuy = async (stock_name: string) => {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stocks/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stock_name, quantity })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Successfully bought ${quantity} shares of ${stock_name}`);
                setSelectedStock(null);
                setQuantity(0);
                setError('');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('An error occurred while buying stocks.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        else {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/list/all-stocks`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setStocks(data);
                } catch (error) {
                    setError('An error occurred while fetching stocks.');
                }
            };
            fetchData();
            const interval = setInterval(fetchData, 60000);
            return () => clearInterval(interval);
        }
    }, [navigate]);

    return (
        <Container maxWidth="lg" sx={{ paddingTop: '40px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }}>Available Stocks</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Stock</TableCell>
                            <TableCell>News</TableCell>
                            <TableCell>Daily Change</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map((stock, index) => (
                            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                <TableCell>{stock.stock_name}</TableCell>
                                <TableCell>{stock.sentiment}</TableCell>
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
                                                <Typography component="span" color="text.secondary">${(quantity * Number(stock.price)).toFixed(2)}</Typography>
                                            </Box>
                                            <Button variant="contained" size="small" onClick={() => handleBuy(stock.stock_name)}>Confirm</Button>
                                            <Button variant="outlined" size="small" onClick={() => setSelectedStock(null)}>Cancel</Button>
                                        </Box>
                                    ) : (
                                        <Button variant="contained" color="success" onClick={() => { setSelectedStock(stock.stock_name); setQuantity(1); }}>Buy</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
}