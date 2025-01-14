'use strict';
import axios from 'axios';
import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, { email, password });
        return response.data;
    }
    catch (err) {
        return err;
    }
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/user/register`, userData);
    return response.data;
};

export async function checkAuth() {
    const token = Cookies.get('jwt');
    
    try {
        if (!token) {
            return false;
        }
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        return true;
    } catch (error) {
        return false;
    }
}
