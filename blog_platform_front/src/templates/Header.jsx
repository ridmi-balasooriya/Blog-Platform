import React from 'react';
import { Link } from 'react-router-dom';
import { token } from '../components/Auth/Token';
import LogOut from '../components/Auth/LogOut';
const Header = () => {
    return(
        <header>
            <nav>
                <div>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        {token && 
                            <li>My Profile
                                <ul>
                                    <li><Link to='/dashboard'>Dashboard</Link></li>
                                    <li><Link to='/my_profile/'>My Profile</Link></li> 
                                    <li><LogOut /></li>                                    
                                </ul>                                                         
                            </li> 
                        }
                        {!token && <li><Link to='/login'>Log In</Link></li>}
                        {!token && <li><Link to='/register'>Register</Link></li>}
                    </ul>
                </div>
            </nav>
        </header>        
    );
}

export default Header