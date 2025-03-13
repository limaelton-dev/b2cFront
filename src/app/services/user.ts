import { User } from "../types/user";
import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const token = getToken();

export const fetchUser = async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/user`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data();
};

export const fetchWithDetails = async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/user/details`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data();
};




