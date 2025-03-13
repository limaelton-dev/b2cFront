'use strict';
import axios from 'axios';
import { saveToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const loginWithGoogle = async (credential) => {
    try {
        const response = await axios.post(`${API_URL}/user/google-login`, { credential });
        
        if (response.data && response.data.token) {
            saveToken(response.data.token);
        }
        
        return response.data;
    } catch (err) {
        console.error('Erro ao fazer login com Google:', err);
        return err;
    }
}; 