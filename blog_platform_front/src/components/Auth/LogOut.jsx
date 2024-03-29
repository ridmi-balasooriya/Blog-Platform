import React from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import { token, userData} from "./Token";

const LogOut = () => {
    const handleLogout = async () => {   
        
        try{      
            if(token){
                await axios.post(`${API_BASE_URL}/api/logout`, null, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}});
                localStorage.removeItem('token');
                localStorage.removeItem(userData)
                window.location.href = '/login';
            }
                
        }catch (error) {
            console.error('LogOut Fail: ', error);
        }
    }

    return (
        <button onClick={handleLogout}  type="button" className="btn btn-link ps-sm-0">Log Out</button>
    )

}

export default LogOut