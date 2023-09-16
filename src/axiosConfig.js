import axios from 'axios';

const TODO_API_URL = process.env.REACT_APP_TODO_API_URL || 'http://localhost:5000';
const BRIDGE_API_URL = process.env.REACT_APP_BRIDGE_API_URL || 'http://localhost:5001';

const token = localStorage.getItem('token');
const commonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
}

const todoApi = axios.create({
    baseURL: TODO_API_URL,
    headers: {
        Authorization: `Bearer ${token}`,
        ...commonHeaders
    }
});

const bridgeApi = axios.create({
    baseURL: BRIDGE_API_URL,
    headers: {
        ...commonHeaders
    }
});

export {
    todoApi,
    bridgeApi
};