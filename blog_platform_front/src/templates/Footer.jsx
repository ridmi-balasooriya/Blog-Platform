import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return(
        <footer className='container-fluid bg-primary text-center p-2 pt-3 mt-5'>
             <p className='fs-6'>&copy; {currentYear} Tech Talk. All rights reserved. | Designed and developed by Ridmi Balasooriya | This blog platform serves as a showcase of my technical skills and is created solely for demonstration purposes.</p>
        </footer>
    );
}

export default Footer;