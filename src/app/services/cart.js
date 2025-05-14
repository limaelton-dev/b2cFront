'use strict';
import axios from 'axios';
import { getAuthHeader, isAuthenticated } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Obtém o carrinho do usuário
 * @returns {Promise<Object>} Objeto com os dados do carrinho
 */
export const getCart = async () => {
  if (!isAuthenticated()) {
    return { 
      id: 0,
      subtotal: "0.00",
      total: "0.00",
      items: []
    };
  }

  try {
    console.log('Buscando carrinho na API...');
    const response = await axios.get(`${API_URL}/cart`, {
      headers: getAuthHeader()
    });
    
    console.log('Resposta do carrinho:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    
    // Se o erro for de autenticação ou o carrinho não existir, retornamos um carrinho vazio
    return { 
      id: 0,
      subtotal: "0.00",
      total: "0.00",
      items: []
    };
  }
};

/**
 * Adiciona um item ao carrinho
 * @param {number} productId - ID do produto
 * @param {number} quantity - Quantidade
 * @returns {Promise<Object>} Objeto com os dados do carrinho atualizado
 */
export const addCartItem = async (productId, quantity = 1) => {
  if (!isAuthenticated()) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await axios.post(`${API_URL}/cart/items`, {
      productId,
      quantity
    }, {
      headers: getAuthHeader()
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    throw error;
  }
};

/**
 * Atualiza a quantidade de um item no carrinho
 * @param {number} itemId - ID do item do carrinho
 * @param {number} quantity - Nova quantidade
 * @returns {Promise<Object>} Objeto com os dados do carrinho atualizado
 */
export const updateCartItem = async (itemId, quantity) => {
  if (!isAuthenticated()) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await axios.put(`${API_URL}/cart/items/${itemId}`, {
      quantity
    }, {
      headers: getAuthHeader()
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    throw error;
  }
};

/**
 * Remove um item do carrinho
 * @param {number} itemId - ID do item do carrinho
 * @returns {Promise<Object>} Objeto com os dados do carrinho atualizado
 */
export const removeCartItem = async (itemId) => {
  if (!isAuthenticated()) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await axios.delete(`${API_URL}/cart/items/${itemId}`, {
      headers: getAuthHeader()
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    throw error;
  }
};

/**
 * Limpa o carrinho completamente
 * @returns {Promise<Object>} Objeto com os dados do carrinho limpo
 */
export const clearCart = async () => {
  if (!isAuthenticated()) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await axios.delete(`${API_URL}/cart`, {
      headers: getAuthHeader()
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    throw error;
  }
}; 