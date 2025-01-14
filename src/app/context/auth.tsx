"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../interfaces/interfaces';
import { checkAuth } from '../services/auth';

const AuthContext = createContext<AuthContextType>({
    user: {
        id: 0,
        name: '',
        email: ''
    },
    setUserFn: () => {},
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState<User>({
        id: 0,
        name: '',
        email: ''
    });

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const isAuthenticated = await checkAuth();
                setAuth(isAuthenticated);
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                setAuth(false);
            }
        };

        validateAuth();
    }, []);
    
    useEffect(() => {
        if(localStorage.getItem('user') != null && auth) {
            setUser(JSON.parse(localStorage.getItem('user')))
        }
    }, [auth]);
    
    const setUserFn = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    return <AuthContext.Provider value={{ user, setUserFn }}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
    return useContext(AuthContext);
};