// /src/components/Register.js
import React, {useState} from 'react';
import axios from 'axios';
import {Box, TextField, Button, Typography, Grid} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import ErrorToast from './ErrorToast';

const Register = ({handleRegister, navigate}) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        senhaConfirm: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const validateForm = () => {
        let formErrors = [];
        if (!formData.nome) formErrors.push('O nome é obrigatório');
        if (!formData.email) formErrors.push('O e-mail é obrigatório');
        if (formData.senha !== formData.senhaConfirm) {
            formErrors.push('As senhas não coincidem');
        }
        if (formData.senha.length < 5) {
            formErrors.push('A senha deve ter no mínimo 5 caracteres');
        }
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (formErrors.length > 0) {
            toast.error(<ErrorToast errors={formErrors}/>);
        } else {

            axios.post('/usuario', formData)
                .then(response => {
                    const {access_token: token} = response.data;
                    localStorage.setItem('token', token);
                    handleRegister();
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        const errorsArray = error.response.data.map(error => error.msg);
                        toast.error(<ErrorToast errors={errorsArray}/>); // Use o componente ErrorToast personalizado
                    } else {
                        const errorMessage = 'Erro ao registrar usuário';
                        toast.error(<ErrorToast errors={[errorMessage]}/>); // Use o componente ErrorToast personalizado
                    }
                });
        }
    };

    return (
        <Box sx={{width: '100%', maxWidth: 400, mx: 'auto'}}>
            <ToastContainer/>
            {/*<Typography variant="h4" align="center" gutterBottom>*/}
            {/*    Registrar-se*/}
            {/*</Typography>*/}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    name="nome"
                    label="Nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="senha"
                            label="Senha"
                            type="password"
                            value={formData.senha}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="senhaConfirm"
                            label="Confirmar Senha"
                            type="password"
                            value={formData.senhaConfirm}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Box sx={{mt: 3}}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disableElevation
                    >
                        Registrar
                    </Button>
                </Box>
                <Box sx={{mt: 2}}>
                    <Typography variant="body2" align="center">
                        Já possui uma conta?
                        {' '}
                        <Button onClick={navigate} color="primary">
                            Acesse agora
                        </Button>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
};

export default Register;
