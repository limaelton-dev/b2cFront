"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../interfaces/interfaces';
import { checkAuth, logout as logoutService } from '../services/auth';
import { removeToken } from '../utils/auth';

const AuthContext = createContext<AuthContextType>({
    user: {
        id: 0,
        name: '',
        email: ''
    },
    setUserFn: () => {},
    logout: () => {},
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
        } else if (!auth) {
            // Se não estiver autenticado, limpa os dados do usuário
            setUser({
                id: 0,
                name: '',
                email: ''
            });
        }
    }, [auth]);
    
    const setUserFn = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    const logout = () => {
        // Remove o token JWT
        logoutService();
        // Limpa os dados do usuário
        localStorage.removeItem('user');
        setUser({
            id: 0,
            name: '',
            email: ''
        });
        setAuth(false);
    }

    return <AuthContext.Provider value={{ user, setUserFn, logout }}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
    return useContext(AuthContext);
};