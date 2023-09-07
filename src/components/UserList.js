// /src/components/UserList.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast, ToastContainer} from "react-toastify";
import ErrorToast from "./ErrorToast";

const UserList = ({loggedUser}) => {
    const [userList, setUserList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        const response = await axios.get('/usuarios');
        setUserList(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditUser = async (user) => {
        const formErrors = validateForm();
        if (formErrors.length > 0) {
            toast.error(<ErrorToast errors={formErrors}/>);
            return;
        }

        try {
            await axios.put(`/usuario`, user);
            handleCloseEditDialog();
            fetchUsers();
        } catch (error) {
            console.log(error)
            let editErrors = [];
            if (error.response && error.response.data) {
                for (const err of error.response.data) {
                    const {msg} = err;
                    editErrors.push(msg);
                }
                toast.error(<ErrorToast errors={editErrors}/>);
            }
        }
    };

    const handleDeleteUser = async (id) => {
        await axios.delete(`/usuario`, {data: {id}});
        fetchUsers();
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const validateForm = () => {
        let formErrors = [];
        if (!selectedUser.nome) formErrors.push('O nome é obrigatório');
        if (!selectedUser.email) formErrors.push('O e-mail é obrigatório');
        if (selectedUser.senha !== selectedUser.senhaConfirm) {
            formErrors.push('As senhas não coincidem');
        }
        if (selectedUser.senha && selectedUser.senha.length < 5) {
            formErrors.push('A senha deve ter no mínimo 5 caracteres');
        }
        return formErrors;
    }

    return (
        <Box>
            <ToastContainer/>
            <Typography variant="h4" align="center" gutterBottom>
                Lista de Usuários
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.nome}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        <EditIcon/>
                                    </IconButton>

                                    {user.id !== 1 && (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                {/*exibir o nome selectedUser no title */}
                <DialogTitle>Editar Usuário {selectedUser?.nome}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        type="text"
                        fullWidth
                        value={selectedUser?.nome || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, nome: e.target.value})}
                    />
                    <TextField
                        disabled={selectedUser?.id === 1}
                        margin="dense"
                        label="E-mail"
                        type="email"
                        fullWidth
                        value={selectedUser?.email || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    />
                    {selectedUser?.id === loggedUser.id ? (
                        <>
                            <TextField
                                margin="dense"
                                label="Senha"
                                type="password"
                                fullWidth
                                value={selectedUser?.senha || ''}
                                onChange={(e) => setSelectedUser({...selectedUser, senha: e.target.value})}
                            />
                            <TextField
                                margin="dense"
                                label="Confirmar Senha"
                                type="password"
                                fullWidth
                                value={selectedUser?.senhaConfirm || ''}
                                onChange={(e) => setSelectedUser({...selectedUser, senhaConfirm: e.target.value})}
                            />
                        </>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleCloseEditDialog();
                    }}
                            color="secondary"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            handleEditUser(selectedUser);
                        }}
                        color="primary"
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Deseja excluir o usuário?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ao confirmar, o usuário será excluído permanentemente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            handleDeleteUser(selectedUser.id);
                            handleCloseDeleteDialog();
                        }}
                        color="secondary"
                        autoFocus
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserList;
