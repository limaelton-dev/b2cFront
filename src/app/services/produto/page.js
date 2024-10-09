'use strict';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getProduto = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/produtos/${id}`);
        return response;
    }
    catch (err) {
        return err;
    }
};


export const getProdsArr = async (arr) => {
    try {
        console.log(arr, arr.join(','));
        const response = await axios.get(`${API_URL}/produtos/${arr.join(',')}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

