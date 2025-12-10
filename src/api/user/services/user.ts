import { User } from "../types/user";
import { Card } from "../profile/cards/types/card";
import { Address } from "../profile/addresses/types/address";
import { Phone } from "../profile/phones/types/phone";
// import axios from "axios";
// import { getToken } from "../utils/auth";

// Dados mockados para simular a API
const mockUser: User = {
  id: 1,
  email: "johndoe@example.com",
  profile_type: "PF",
  profile: {
    profile_id: 101,
    full_name: "John Doe",
    cpf: "123.456.789-00",
    birth_date: "1990-01-01",
    gender: "M"
  },
  address: [
    {
      id: 1,
      street: "Rua Exemplo",
      number: "123",
      complement: "Apto 101",
      neighborhood: "Bairro Legal",
      city: "São Paulo",
      state: "SP",
      zip_code: "01000-000",
      is_default: true
    }
  ],
  phone: [
    {
      id: 1,
      number: "987654321",
      ddd: "11",
      is_default: true,
      verified: true
    }
  ],
  card: [
    {
      id: 1,
      card_number: "4111111111111111",
      holder_name: "John Doe",
      expiration_date: "12/2025",
      is_default: true,
      cvv: "123",
      brand: "elo"
    }
  ]
};

const mockCards: Card[] = mockUser.card || [];
const mockAddresses: Address[] = mockUser.address || [];
const mockPhones: Phone[] = mockUser.phone || [];

// Função para simular um delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Em um cenário real você usaria axios e getToken, mas para mock:
// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const token = getToken();

export const fetchUser = async (): Promise<User> => {
  await delay(500); // Simula uma latência de 500ms
  return mockUser;
};

export const fetchWithDetails = async (): Promise<User> => {
  await delay(500);
  return mockUser;
};

export const fetchUserCards = async (): Promise<Card[]> => {
  await delay(500);
  return mockCards;
};

export const fetchUserAddresses = async (): Promise<Address[]> => {
  await delay(500);
  return mockAddresses;
};

export const fetchUserPhones = async (): Promise<Phone[]> => {
  await delay(500);
  return mockPhones;
};

// =======================
// Métodos de Card (CRUD)
// =======================

export const createUserCard = async (cardData: Partial<Card>): Promise<Card> => {
  await delay(500);
  // Simula a criação de um novo cartão gerando um novo ID
  const newCard: Card = {
    id: mockCards.length + 1,
    card_number: cardData.card_number || "0000000000000000",
    holder_name: cardData.holder_name || "",
    expiration_date: cardData.expiration_date || "",
    is_default: cardData.is_default || false,
    cvv: cardData.cvv || "",
    brand: cardData.brand || ""
  };
  mockCards.push(newCard);
  return newCard;
};

export const updateUserCard = async (cardId: number, cardData: Partial<Card>): Promise<Card> => {
  await delay(500);
  const index = mockCards.findIndex(card => card.id === cardId);
  if (index === -1) {
    throw new Error("Card not found");
  }
  const updatedCard: Card = { ...mockCards[index], ...cardData };
  mockCards[index] = updatedCard;
  return updatedCard;
};

export const deleteUserCard = async (cardId: number): Promise<void> => {
  await delay(500);
  const index = mockCards.findIndex(card => card.id === cardId);
  if (index === -1) {
    throw new Error("Card not found");
  }
  mockCards.splice(index, 1);
};

// =======================
// Método para atualizar dados do usuário
// =======================

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  await delay(500);
  Object.assign(mockUser, userData);
  return mockUser;
};


// export const fetchUser = async (): Promise<User> => {
//     const response = await axios.get(`${API_URL}/users`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     return response.data();
// };

// export const fetchWithDetails = async (): Promise<User> => {
//     const response = await axios.get(`${API_URL}/users/details`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     return response.data();
// };

// export const fetchUserCards = async (): Promise<Card[]> => {
//     const response = await axios.get(`${API_URL}/users/cards`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     return response.data();
// };

// export const fetchUserAddresses = async (): Promise<Address[]> => {
//     const response = await axios.get(`${API_URL}/users/addresses`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     return response.data();
// };

// export const fetchUserPhones = async (): Promise<Phone[]> => {
//     const response = await axios.get(`${API_URL}/users/phones`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     return response.data();
// };