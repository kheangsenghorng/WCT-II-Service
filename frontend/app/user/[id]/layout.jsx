import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLayout = ({ children }) => {
    return (
        <div>
            <Navbar  />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default UserLayout;