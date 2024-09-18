'use strict';
import axios from 'axios';

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


