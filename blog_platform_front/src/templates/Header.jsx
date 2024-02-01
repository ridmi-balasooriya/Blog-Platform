import React from 'react';
import { Link } from 'react-router-dom';
import { token } from '../components/Auth/Token';
import LogOut from '../components/Auth/LogOut';
const Header = () => {
    return(
        <header className='container-fluid bg-primary'>
            <nav className='navbar navbar-expand-lg bg-primary navbar-dark fixed-top'>
                <div className='container'>
                    <img src='/tech_talk_logo-dark.png' width="70px" alt='Tech Talk logo' />
                    <ul className='navbar-nav ms-auto'>
                        <li className='nav-item'><Link to='/' className='nav-link'>Home</Link></li>
                        {token && 
                            <li className='nav-item dropdown'><a className='nav-link dropdown-toggle'id='navbarDropdown' role='button' data-bs-toggle='dropdown' aria-expanded='false' href='#dropdown'>Account</a>
                                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                    <li><Link to='/dashboard' className='dropdown-item'>Dashboard</Link></li>
                                    <li><Link to='/my_profile/' className='dropdown-item'>My Profile</Link></li>                                                                         
                                </ul>                                                         
                            </li> 
                        }
                        {token && <li className='nav-item'><LogOut className='nav-link' /></li>}
                        {!token && <li className='nav-item'><Link to='/login' className='nav-link'>Log In</Link></li>}
                        {!token && <li className='nav-item'><Link to='/register' className='nav-link'>Register</Link></li>}
                    </ul>
                </div>
            </nav>
        </header>        
    );
}

export default Header