"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../interfaces/interfaces';

const AuthContext = createContext<AuthContextType>({
    user: {
        id: 0,
        name: '',
        email: ''
    },
    setUserFn: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if(localStorage.getItem('user') != null)
            setUser(JSON.parse(localStorage.getItem('user')))
    }, []);
    
    const setUserFn = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    return <AuthContext.Provider value={{ user, setUserFn }}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
    return useContext(AuthContext);
};