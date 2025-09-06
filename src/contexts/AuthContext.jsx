import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, user: null });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        if (token && user) {
            try {
                setAuth({ token, user: JSON.parse(user) });
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.clear();
            }
        }
        setIsLoading(false);
    }, []);

    const login = (authData) => {
        setAuth(authData);
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
    };

    const signup = (authData) => {
        setAuth(authData);
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{
            ...auth,
            login,
            signup,
            logout,
            isLoading,
            isAuthenticated: !!auth.token && !!auth.user
        }}>
            {children}
        </AuthContext.Provider>
    );
};