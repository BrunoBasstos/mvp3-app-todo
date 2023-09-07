// /src/components/Home.js
import React, {useState} from 'react';
import Login from './Login';
import Register from './Register';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Brightness4Icon from "@mui/icons-material/Brightness4";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from '@mui/icons-material/GitHub';
import {Button} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";

const Home = ({onLogin, toggleDarkMode}) => {
    const [showRegister, setShowRegister] = useState(false);

    const toggleForm = () => {
        setShowRegister(!showRegister);
    };

    const handleRegister = () => {
        toggleForm();
        toast.success('Usuário registrado com sucesso! Faça login para continuar.');
    }

    return (
        <Grid container justifyContent="center" alignItems="center" style={{minHeight: '100vh'}}>
            <ToastContainer/>
            <Grid item style={{maxWidth: '50%'}}>
                <IconButton color="inherit" onClick={toggleDarkMode}
                            sx={{position: 'absolute', top: 12, right: 12}}>
                    <Brightness4Icon/>
                </IconButton>
                <Box>
                    <Typography variant="h4" align="center" gutterBottom>
                        Bem-vindo ao Projeto MVP
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom>
                        Apenas um projeto para validação do aprendizado da primeira sprint do curso de Pós-Graduação em
                        Engenharia de Software da PUC-RIO
                    </Typography>
                    {showRegister ? (
                        <Register handleRegister={handleRegister} navigate={toggleForm}/>
                    ) : (
                        <Login onLogin={onLogin} navigate={toggleForm}/>
                    )}
                </Box>
                <Typography variant="body1" align="center" gutterBottom mt={2}>
                    Conheça o projeto no GitHub:
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Button
                        variant="contained"
                        target="_blank"
                        href="https://github.com/BrunoBasstos/todo-front"
                    ><GitHubIcon/> Frontend React
                    </Button>
                    <Button
                        variant="contained"
                        target="_blank"
                        href="https://github.com/BrunoBasstos/todo-api"
                    ><GitHubIcon/> Backend Python
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Home;
