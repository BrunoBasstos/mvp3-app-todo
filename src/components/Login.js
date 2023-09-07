// /src/components/ErrorToast.js
import React, {useState} from 'react';
import axios from 'axios';
import {Box, TextField, Button, Typography} from '@mui/material';
import {toast, ToastContainer} from "react-toastify";
import ErrorToast from "./ErrorToast";

const Login = ({onLogin, navigate}) => {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const validateForm = () => {
        let formErrors = [];
        if (!formData.email) formErrors.push('Informe seu email');
        if (!formData.senha) formErrors.push('Informe sua senha');
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (formErrors.length > 0) {
            toast.error(<ErrorToast errors={formErrors}/>);
        } else {
            try {
                const response = await axios.post('/login', formData);
                const loggedUser = response.data[0];
                const {access_token: token} = response.data[0];
                localStorage.setItem('token', token);
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                onLogin(loggedUser);
                navigate('/');
            } catch (error) {
                let loginErrors = [];
                if (error.response && error.response.data) {
                    for (const err of error.response.data) {
                        const {msg} = err;
                        loginErrors.push(msg);
                    }
                    toast.error(<ErrorToast errors={loginErrors}/>);
                }
            }
        }
    };

    return (
        <Box sx={{width: '100%', maxWidth: 400, mx: 'auto'}}>
            <ToastContainer/>
            {/*<Typography variant="h4" align="center" gutterBottom>*/}
            {/*    Login*/}
            {/*</Typography>*/}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="senha"
                    label="Senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                />
                <Box sx={{mt: 3}}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disableElevation
                    >
                        Entrar
                    </Button>
                </Box>
                <Box sx={{mt: 2}}>
                    <Typography variant="body2" align="center">
                        Não possui uma conta?
                        {' '}
                        <Button onClick={navigate} color="primary">
                            Cadastre-se
                        </Button>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
};

export default Login;
