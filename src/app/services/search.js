'use strict';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const search = async (busca) => {
    try {
        const response = await axios.get(`${API_URL}/produtos?s=${busca}&limit=5`);
        
        // Verificar se a resposta contém dados
        if (response && response.data) {
            // Processar cada produto para garantir que as imagens estejam disponíveis
            const processedProducts = response.data.map(produto => {
                // Verificar se o produto tem imagens
                if (produto.imagens && Array.isArray(produto.imagens) && produto.imagens.length > 0) {
                    return {
                        ...produto,
                        img: produto.imagens[0].url
                    };
                }
                return {
                    ...produto,
                    imagens: [],
                    img: '' // Usar string vazia como fallback
                };
            });
            
            // Substituir os dados originais pelos processados
            response.data = processedProducts;
        }
        
        return response;
    }
    catch (err) {
        console.error('Erro na busca:', err);
        return err;
    }
};
