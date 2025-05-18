"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../interfaces/interfaces';
import { checkAuth, logout as logoutService, getUserProfile } from '../services/auth';
import { removeToken } from '../utils/auth';

const AuthContext = createContext<AuthContextType>({
    user: {
        id: 0,
        email: '',
        name: ''
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
            return storedUser ? JSON.parse(storedUser) : { id: 0, email: '' };
        }
        return { id: 0, email: '' };
    });

    // Função para carregar o perfil completo do usuário
    const loadUserProfile = async () => {
        try {
            const profileData = await getUserProfile();
            
            if (profileData) {
                // Montando o objeto de usuário com os dados do perfil
                const userData = {
                    id: profileData.id,
                    email: profileData.email,
                    profileId: profileData.profileId,
                    profileType: profileData.profileType,
                    name: profileData.profileType === 'PF' 
                        ? (profileData.profile?.firstName && profileData.profile?.lastName)
                            ? `${profileData.profile.firstName} ${profileData.profile.lastName}`
                            : profileData.profile?.fullName || ''
                        : profileData.profile?.companyName || '',
                    profile: profileData.profile,
                    address: profileData.address,
                    phone: profileData.phone,
                    card: profileData.card
                };
                
                setUserFn(userData);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("Erro ao carregar perfil do usuário:", error);
            return false;
        }
    };

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const isAuthenticated = await checkAuth();
                setAuth(isAuthenticated);
                
                if (isAuthenticated) {
                    // Se autenticado, carrega o perfil completo
                    await loadUserProfile();
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                logout();
            }
        };
        
        validateAuth();
    }, []);
    
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
            email: ''
        });
        setAuth(false);
    }

    return <AuthContext.Provider value={{ user, setUserFn, logout }}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
    return useContext(AuthContext);
};