import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?offset=0&limit=12`);
        console.log('Buscando produtos via ANYMARKET:', JSON.stringify(response.data));
        return response.data;
    }
    catch (err) {
        console.error('Erro ao obter produtos via ANYMARKET:', err);
        return err;
    }
}