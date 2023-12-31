import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from '../../config';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post(`${API_BASE_URL}/api/token`, {username, password});
            const token = response.data.token; // Assuming the response contains the token upon successful login.
            localStorage.setItem('token', token);  // Store the token securely (e.g., in local storage).

            const userData = {
                id: response.data.user_id,
                username: response.data.user_name,
            }
            localStorage.setItem('userData',JSON.stringify(userData))
            window.location.href = '/'; // Redirect to the home page or any desired page.
        }catch (error) {
            setError('Invalid Login Credentials')
        }
    };

    return(
        <div>
            <h1>Login</h1>
            {error && <div>{error}</div>}
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /> 
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <div><Link to='/password_reset'>Forgot Your Password?</Link></div>
            <div>New to Our Platform? <Link to='/register'>Please Register</Link></div>
        </div>
    )

}

export default LogIn