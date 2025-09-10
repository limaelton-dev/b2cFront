import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchCategoryMenu = async () => {
    try {
        const response = await axios.get(`${API_URL}/category/menu`);
        console.log('Buscando categorias via ANYMARKET:', JSON.stringify(response.data));
        return response.data;
    }
    catch (err) {
        console.error('Erro ao obter categorias via ANYMARKET:', err);
        return err;
    }
}

export const fetchRootCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/category`);
        console.log('Buscando categorias via ANYMARKET:', JSON.stringify(response.data));
        return response.data;
    }
    catch (err) {
        console.error('Erro ao obter categorias via ANYMARKET:', err);
        return err;
    }
}