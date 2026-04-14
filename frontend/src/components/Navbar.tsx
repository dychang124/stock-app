import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
}