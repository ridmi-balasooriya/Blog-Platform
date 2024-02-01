import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return(
        <footer className='container-fluid bg-primary text-center p-2 pt-3 mt-5'>
             <p>&copy; {currentYear} Tech Talk. All rights reserved. | Designed and developed by Ridmi Balasooriya</p>
        </footer>
    );
}

export default Footer;