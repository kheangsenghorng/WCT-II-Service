"use client";
import React from 'react';
import { useParams } from 'next/navigation'; // Assuming you're using react-router or similar


const MyProfilePage = () => {
    const { id } = useParams(); // Get the user ID from the URL
    return (
        <div>

            Profile Page for User ID: {id}
            {/* Add your profile details here */}   
            <div>
                <h1>Welcome to your profile!</h1>
                <p>Your user ID is: {id}</p>
                {/* Add more profile details here */}
                <p>Here you can manage your account settings, view your activity, and more.</p>
                <p>Feel free to customize this page as per your requirements.</p>
                </div>
            
        </div>
    );
};

export default MyProfilePage;