'use strict';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const getProfileUser = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/profile/getProfileByUser/${id}`);
        return response.data;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
};
