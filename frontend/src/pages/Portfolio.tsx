import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Portfolio() {
    const [username, setUsername] = useState('');
    const [balance, setBalance] = useState(0);
    type UserStock = { stock_name: string; quantity: number; price: string };
    const [userStocks, setUserStocks] = useState<UserStock[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(0);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        try {
            const response = await fetch('http://localhost:3000/list/username', {
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
            const response = await fetch('http://localhost:3000/list/balance', {
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
            const response = await fetch('http://localhost:3000/list/user-stocks', {
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
        fetchData();
    }, []);

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
            const response = await fetch('http://localhost:3000/stocks/sell', {
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
    
    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <h1 style={{ textAlign: 'center' }}>Welcome, {username}</h1>
                <h1 style={{ textAlign: 'center' }}>Balance: ${Number(balance).toFixed(2)}</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {userStocks.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Stock</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStocks.map((stock, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{stock.stock_name}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{stock.quantity}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>${Number(stock.price).toFixed(2)}</td>
                                    <td>
                                        {selectedStock === stock.stock_name ? (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <input 
                                                        type="number" 
                                                        value={quantity || ''}
                                                        min="1"  
                                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))} 
                                                    />
                                                    <span>${(quantity * Number(stock.price)).toFixed(2)}</span>
                                                </div>
                                                <button onClick={() => handleSell(stock.stock_name)}>Confirm</button>
                                                <button onClick={() => setSelectedStock(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => { setSelectedStock(stock.stock_name); setQuantity(1); }}>Sell</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: 'center' }}>You don't own any stocks</p>
                )}
            </div>
        </div>
    );
}