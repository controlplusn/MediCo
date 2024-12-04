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
        }
    },

    login: async (username, password) => {
        set({ error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            set({ 
                isAuthenticated: true,
                user: response.data.user,
                error: null
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up" });
        }
    },

    logout: async () => {
        set({ error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ 
                isAuthenticated: false,
                user: null,
                error: null
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error logging out" });
        }
    },

    checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
}))