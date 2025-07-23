import React from 'react';
import LeftImagePanel from './LeftImagePanel';

type AuthLayoutProps = {
    children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <LeftImagePanel />

            {/* Right Content Section */}
            <div className="flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
