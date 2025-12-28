import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import LoginModal from './LoginModal';
import LoadingSpinner from '../../ui/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return <LoginModal />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
