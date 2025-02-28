import { useState, useEffect } from 'react';
import { DadosPessoaisType, EnderecoType, CartaoType, CompraType } from '../types';

// Este hook será expandido para integrar com a API quando estiver disponível
export const useUserData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dados pessoais do usuário
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoaisType>({
    nome: 'João Alvino Silva',
    cpf: '581.728.380-85',
    email: 'joaosilva24@email.com',
    username: 'joaoSilva24',
    dob: '01/11/1985',
    phone: '+55 (42) 99059-9905',
  });
  
  // Endereços do usuário
  const [enderecos, setEnderecos] = useState<EnderecoType[]>([
    {
      id: 1,
      address: 'Rua João Amaral, 150',
      bairro: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '68509-652',
      isPrincipal: true
    },
    {
      id: 2,
      address: 'Avenida Paulista, 1578',
      bairro: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      cep: '01310-200',
      isPrincipal: false
    }
  ]);
  
  // Cartões do usuário
  const [cartoes, setCartoes] = useState<CartaoType[]>([
    { 
      id: 1, 
      nome: 'João Silva', 
      numero: '4111111111111111', 
      validade: '12/24',
      cvv: '123'
    },
    { 
      id: 2, 
      nome: 'João Silva', 
      numero: '5555555555554444', 
      validade: '08/23',
      cvv: '321'
    },
  ]);
  
  // Compras do usuário
  const [compras, setCompras] = useState<CompraType[]>([]);
  
  // Simula o carregamento de dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Aqui será implementada a chamada à API para buscar os dados do usuário
        // Por enquanto, vamos simular um atraso para mostrar o loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados mockados para compras
        // Quando a API estiver disponível, esses dados virão dela
        setCompras([
          {
            id: 1,
            produtos: [
              { nome: 'HeadPhone C3TECH p2', valor: 'R$ 350,00', quantidade: 3, imagem: '/headphone.png' },
              { nome: 'HeadPhone LOGITECH p2', valor: 'R$ 150,00', quantidade: 2, imagem: '/headphone.png' },
            ],
            status: 'A caminho',
            data: '15/10/2024',
          },
          {
            id: 2,
            produtos: [
              { nome: 'Produto 3', valor: 'R$ 150,00', quantidade: 1, imagem: '/headphone.png' },
            ],
            status: 'Entregue',
            data: '10/05/2024',
          },
          {
            id: 3,
            produtos: [
              { nome: 'Produto 4', valor: 'R$ 150,00', quantidade: 3, imagem: '/headphone.png' },
            ],
            status: 'Cancelada',
            data: '10/05/2023',
          },
          {
            id: 4,
            produtos: [
              { nome: 'Produto 5', valor: 'R$ 150,00', quantidade: 3, imagem: '/headphone.png' },
            ],
            status: 'Processando',
            data: '10/05/2023',
          },
        ]);
        
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do usuário');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchData();
  }, []);
  
  // Funções para atualizar os dados do usuário
  const updateDadosPessoais = (newData: Partial<DadosPessoaisType>) => {
    setDadosPessoais(prev => ({ ...prev, ...newData }));
    // Aqui será implementada a chamada à API para atualizar os dados
  };
  
  const addEndereco = (endereco: Omit<EnderecoType, 'id'>) => {
    const newId = Math.max(0, ...enderecos.map(e => e.id)) + 1;
    const newEndereco = { ...endereco, id: newId };
    setEnderecos(prev => [...prev, newEndereco]);
    // Aqui será implementada a chamada à API para adicionar o endereço
  };
  
  const updateEndereco = (id: number, endereco: Partial<EnderecoType>) => {
    setEnderecos(prev => prev.map(e => e.id === id ? { ...e, ...endereco } : e));
    // Aqui será implementada a chamada à API para atualizar o endereço
  };
  
  const removeEndereco = (id: number) => {
    setEnderecos(prev => prev.filter(e => e.id !== id));
    // Aqui será implementada a chamada à API para remover o endereço
  };
  
  const setEnderecoPrincipal = (id: number) => {
    setEnderecos(prev => prev.map(e => ({ ...e, isPrincipal: e.id === id })));
    // Aqui será implementada a chamada à API para definir o endereço principal
  };
  
  const addCartao = (cartao: Omit<CartaoType, 'id'>) => {
    const newId = Math.max(0, ...cartoes.map(c => c.id)) + 1;
    const newCartao = { ...cartao, id: newId };
    setCartoes(prev => [...prev, newCartao]);
    // Aqui será implementada a chamada à API para adicionar o cartão
  };
  
  const updateCartao = (id: number, cartao: Partial<CartaoType>) => {
    setCartoes(prev => prev.map(c => c.id === id ? { ...c, ...cartao } : c));
    // Aqui será implementada a chamada à API para atualizar o cartão
  };
  
  const removeCartao = (id: number) => {
    setCartoes(prev => prev.filter(c => c.id !== id));
    // Aqui será implementada a chamada à API para remover o cartão
  };
  
  return {
    loading,
    error,
    dadosPessoais,
    enderecos,
    cartoes,
    compras,
    updateDadosPessoais,
    addEndereco,
    updateEndereco,
    removeEndereco,
    setEnderecoPrincipal,
    addCartao,
    updateCartao,
    removeCartao,
  };
}; 