import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return(
        <footer>
             <p>&copy; {currentYear} Tech Talk. All rights reserved. | Designed and developed by Ridmi Balasooriya</p>
        </footer>
    );
}

export default Footer;