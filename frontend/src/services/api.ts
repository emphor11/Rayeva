import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rayeva-backend-3.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productApi = {
    categorize: async (title: string, description: string) => {
        const response = await api.post('/products/categorize', { title, description });
        return response.data;
    },
};

export const proposalApi = {
    generate: async (params: {
        customerName: string;
        budgetLimit: number;
        sustainabilityPreferences: string[];
    }) => {
        const response = await api.post('/proposals/generate', params);
        return response.data;
    },
};

export const statsApi = {
    getSummary: async () => {
        const response = await api.get('/stats/summary');
        return response.data;
    },
    getUsage: async () => {
        const response = await api.get('/stats/usage');
        return response.data;
    },
    getLogs: async () => {
        const response = await api.get('/stats/logs');
        return response.data;
    },
};

export default api;
