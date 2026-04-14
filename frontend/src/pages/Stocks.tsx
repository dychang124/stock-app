import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Stocks() {
    type stock = { stock_name: string; daily_change: number; price: string };
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
            const response = await fetch('http://localhost:3000/stocks/buy', {
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
                    const response = await fetch('http://localhost:3000/list/all-stocks', {
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
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <h1 style={{ textAlign: 'center' }}>Available Stocks</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Stock</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Daily Change</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{stock.stock_name}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{(Number(stock.daily_change) >= 0 ? '+' : '') + Number(stock.daily_change).toFixed(2)}</td>
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
                                                <button onClick={() => handleBuy(stock.stock_name)}>Confirm</button>
                                                <button onClick={() => setSelectedStock(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => { setSelectedStock(stock.stock_name); setQuantity(1); }}>Buy</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>
    );
}