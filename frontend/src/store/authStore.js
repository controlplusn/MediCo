import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3001/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null, // update user to be the actual user that is authenticated
    isAuthenticated: false, // Token
    error: null,
    isCheckingAuth: true,

    signup: async (email, username, password) => {
        set({ error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, username, password });
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up" });
            throw(error);
        }
    }
}))