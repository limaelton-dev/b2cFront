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

// Função auxiliar para verificar se estamos no navegador
const isBrowser = () => typeof window !== 'undefined';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<User>(() => {
        if (isBrowser()) {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : { id: 0, name: '', email: '' };
        }
        return { id: 0, name: '', email: '' };
    });

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const isAuthenticated = await checkAuth();
                setAuth(isAuthenticated);
                
                if (!isAuthenticated) {
                    logout();
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                logout();
            }
        };
        
        validateAuth();
    }, []);
    
    useEffect(() => {
        if (auth && isBrowser() && localStorage.getItem("user")) {
            setUser(JSON.parse(localStorage.getItem("user")));
        }
    }, [auth]);
    
    const setUserFn = (user: User) => {
        setUser(user);
        if (isBrowser()) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    const logout = () => {
        // Remove o token JWT
        logoutService();
        // Limpa os dados do usuário
        if (isBrowser()) {
            localStorage.removeItem('user');
        }
        removeToken();
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