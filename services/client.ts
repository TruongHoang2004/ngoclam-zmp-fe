import config from '@/config/env.config';
import axios from 'axios';

const API_BASE_URL = config.backend.apiBaseUrl;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
