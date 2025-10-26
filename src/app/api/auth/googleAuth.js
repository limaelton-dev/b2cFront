'use strict';
import axios from 'axios';
import { saveToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const isBrowser = () => typeof window !== 'undefined';

export const loginWithGoogle = async (credential) => {
    try {
        const response = await axios.post(`${API_URL}/auth/google`, { credential });
        
        if (response.data && response.data.access_token) {
            saveToken(response.data.access_token);
            
            const userData = response.data.user;
            
            if (isBrowser()) {
                localStorage.setItem('user', JSON.stringify({
                    id: userData.id,
                    email: userData.email,
                    profile_id: userData.profileId,
                    profile_type: userData.profileType
                }));
            }
        }
        
        return response.data;
    } catch (err) {
        console.error('Erro ao fazer login com Google:', err);
        return err;
    }
}; 