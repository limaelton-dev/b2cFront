import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchBrands = async () => {
    try {
        const response = await axios.get(`${API_URL}/brands`);
        console.log('Buscando marcas via ANYMARKET:', JSON.stringify(response.data));
        return response.data;
    }
    catch (err) {
        console.error('Erro ao obter marcas via ANYMARKET:', err);
        return err;
    }
}