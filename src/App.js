// /src/App.js
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {todoApi} from './axiosConfig';
import {Container} from '@mui/material';
import TaskList from './components/TaskList';
import UserList from './components/UserList';
import Header from './components/Header';
import Home from './components/Home';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedUser, setLoggedUser] = useState({});
    const [darkMode, setDarkMode] = useState(() => {
        const localDarkMode = localStorage.getItem('darkMode');
        return localDarkMode === 'true';
    });

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            todoApi.defaults.headers.common.Authorization = `Bearer ${token}`;
            setIsLoggedIn(true);
            todoApi.get("/auth")
                .then((response) => {
                    setIsLoggedIn(true);
                    setLoggedUser(response.data);
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoggedIn(false);
                    setLoggedUser({});
                    localStorage.removeItem("token");
                });
        } else {
            todoApi.defaults.headers.common.Authorization = null;
            setIsLoggedIn(false);
            setLoggedUser({});
        }
    }, []);

    const handleLogin = (usuario) => {
        setIsLoggedIn(true);
        setLoggedUser(usuario);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        todoApi.defaults.headers.common.Authorization = null;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>

                <div>
                    {isLoggedIn &&
                        <Header isLoggedIn={isLoggedIn} loggedUser={loggedUser} handleLogout={handleLogout}
                                toggleDarkMode={toggleDarkMode}/>}

                    <Container className="mt-3">
                        <Routes>
                            {isLoggedIn ? (
                                <>
                                    <Route path="/" element={<TaskList loggedUser={loggedUser}/>}/>
                                    {loggedUser?.perfil === 'administrador' && (
                                        <Route path="/usuarios" element={<UserList loggedUser={loggedUser}/>}/>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Route path="*"
                                           element={<Home onLogin={handleLogin} toggleDarkMode={toggleDarkMode}/>}/>
                                </>
                            )}
                        </Routes>
                    </Container>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
