import axios from 'axios';

const axiosConfig = () => {
    axios.defaults.baseURL = 'http://localhost:5000';

    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        axios.defaults.headers.common.Authorization = null;
    }
};

export default axiosConfig;
