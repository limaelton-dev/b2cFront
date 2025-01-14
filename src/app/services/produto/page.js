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
        const response = await axios.get(`${API_URL}/produtos/${arr.join(',')}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

export const getCart = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/carrinho/${id}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

export const cartUpdate = async (user, data) => {
    try {
        const response = await axios.patch(`${API_URL}/carrinho/${user}`, { cart_data: data });
        return response;
    }
    catch (err) {
        return err;
    }
};

