import React from 'react';
import bgImage from '../assets/windows-bg.jpg';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl min-h-[600px] bg-white rounded-2xl shadow-lg flex overflow-hidden">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    {children}
                </div>
                {/* Right Side - Image */}
                <div className="hidden md:block md:w-1/2">
                    <img src={bgImage} alt="Abstract background" className="object-cover w-full h-full" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;