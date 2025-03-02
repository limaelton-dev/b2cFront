'use strict';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const search = async (busca) => {
    try {
        const response = await axios.get(`${API_URL}/produtos?s=${busca}&limit=5`);
        return response;
    }
    catch (err) {
        return err;
    }
};
