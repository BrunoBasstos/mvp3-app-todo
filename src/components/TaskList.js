// /src/components/TaskList.js
import React, {useState, useEffect} from "react";
import {todoApi, bridgeApi} from "../axiosConfig";
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from "@mui/material";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {toast, ToastContainer} from "react-toastify";
import ErrorToast from "./ErrorToast";
import dayjs from "dayjs";

import TaskCard from "./TaskCard";
import TaskDetails from './TaskDetails';
import TaskDialogForm from './TaskDialogForm';
import Advice from "./Advice";


const TaskList = ({loggedUser}) => {
    const [tasks, setTasks] = useState([]);
    const [prioridadesList, setPrioridadesList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({
        titulo: "",
        descricao: "",
        status: "",
        prioridade: "",
        data_tarefa: new Date(),
        cidade: "",
    });
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [cityOptions, setCityOptions] = useState([]);
    const [citySearch, setCitySearch] = useState("");
    const [isSelectedCity, setIsSelectedCity] = useState(false);

    useEffect(() => {
        fetchPrioridades();
        fetchStatus();
        fetchTasks();
    }, [loggedUser]);

    const handleEditTask = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleSaveEdit = async () => {
        await updateTask(selectedTask.id, selectedTask, selectedTask.status);
        setEditMode(false);
    };

    const moveTask = (taskId, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? {...task, status: newStatus} : task
            )
        );
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseDetails = () => {
        setEditMode(false);
        setSelectedTask(null);
    };

    const fetchPrioridades = async () => {
        const response = await todoApi.get("/prioridade");
        setPrioridadesList(response.data);
    };

    const fetchStatus = async () => {
        const response = await todoApi.get("/status");
        setStatusList(response.data);
    };

    const fetchTasks = async () => {
        const response = await todoApi.get("/tarefas");
        let tmpTasks = response.data;

        const weatherPromises = tmpTasks.map(async (task) => {
            if (!task.cidade || task.data_conclusao) return task;

            if (dayjs(task.data_tarefa).isSame(dayjs(), "day")) {
                const response = await bridgeApi.get(`/weather/${task.cidade}`);
                task.weather = response.data;
            } else if (dayjs(task.data_tarefa).isAfter(dayjs(), "day")) {
                const response = await bridgeApi.get(`/forecast/${task.cidade}`);
                task.weather = response.data;
            }
            return task;
        });

        const updatedTasks = await Promise.all(weatherPromises);
        setTasks(updatedTasks);
    };


    const addTask = async () => {
        const formErrors = validateForm();
        if (formErrors.length > 0) {
            toast.error(<ErrorToast errors={formErrors}/>);
            return;
        }

        await todoApi.post("/tarefa", newTask);
        setNewTask({
            titulo: "",
            descricao: "",
            status: "",
            prioridade: "",
            cidade: "",
            data_tarefa: new Date(),
        });
        fetchTasks();
        handleClose();
    };

    const deleteTask = async (id) => {
        await todoApi.delete(`/tarefa`, {data: {id: id}});
        fetchTasks();
    };

    const updateTask = async (id, task, newStatus) => {
        try {
            await todoApi.put(`/tarefa`, {...task, status: newStatus});
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
            moveTask(id, task.status);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onDragEnd = (result) => {
        const {destination, source, draggableId} = result;
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const task = tasks.find((t) => t.id === parseInt(draggableId));
        moveTask(task.id, destination.droppableId);
        updateTask(task.id, task, destination.droppableId);
    };

    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    const fetchCities = async (value) => {
        try {
            const response = await bridgeApi.get(`/location/search/${value}`);
            setCityOptions(response.data);
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (citySearch && !isSelectedCity) {
                fetchCities(citySearch);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [citySearch]);

    const handleCityInputChange = (value) => {
        setCitySearch(value);
        setIsSelectedCity(false);
        if (!value) {
            setCityOptions([]);
        }
    };

    const validateForm = () => {
        let formErrors = [];
        if (!newTask.titulo) formErrors.push("O campo título é obrigatório");
        if (!newTask.descricao) formErrors.push("O campo descrição é obrigatório");
        if (!newTask.prioridade)
            formErrors.push("O campo prioridade é obrigatório");
        if (!newTask.status) formErrors.push("O campo status é obrigatório");

        if (!newTask.cidade || !newTask.data_tarefa) {
            toast.warn(
                <ErrorToast
                    errors={[
                        "Não será possível exibir a previsão do tempo para essa tarefa porque a cidade e/ou a data não foram preenchidas.",
                    ]}
                />
            );
        }
        return formErrors;
    };

    return (
        <Box>
            <ToastContainer/>
            <Advice message="Lembre-se de revisar suas tarefas diariamente!"/>
            <Typography variant="h4" align="center">
                Lista de Tarefas
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Adicionar Tarefa
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Adicionar Tarefa</DialogTitle>
                <DialogContent>
                    <TaskDialogForm
                        task={newTask}
                        setTask={setNewTask}
                        prioridadesList={prioridadesList}
                        statusList={statusList}
                        cityOptions={cityOptions}
                        handleCityInputChange={handleCityInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={addTask}>Adicionar</Button>
                </DialogActions>
            </Dialog>

            <DragDropContext onDragEnd={onDragEnd}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    style={{marginTop: "16px"}}
                >
                    {statusList.map((status) => (
                        <Grid item key={status} xs={12} sm={6} md={4}>
                            <Typography variant="h6" align="center">
                                {status} ({getTasksByStatus(status).length})
                            </Typography>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        minHeight="200px"
                                        bgcolor="grey.200"
                                        borderRadius="4px"
                                        p={1}
                                    >
                                        {getTasksByStatus(status).map((task, index) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                deleteTask={deleteTask}
                                                handleTaskClick={handleTaskClick}
                                                loggedUser={loggedUser}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
            <Dialog open={Boolean(selectedTask)} onClose={handleCloseDetails} fullWidth maxWidth="sm">
                {editMode ? (
                    <>
                        <DialogTitle>Editar Tarefa</DialogTitle>
                        <DialogContent>

                            <TaskDialogForm
                                task={selectedTask}
                                setTask={setSelectedTask}
                                prioridadesList={prioridadesList}
                                statusList={statusList}
                                cityOptions={cityOptions}
                                handleCityInputChange={handleCityInputChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelEdit}>Cancelar</Button>
                            <Button onClick={handleSaveEdit}>Salvar</Button>
                        </DialogActions>
                    </>
                ) : (
                    <TaskDetails
                        selectedTask={selectedTask}
                        handleEdit={handleEditTask}
                        handleClose={() => setSelectedTask(null)}
                    />
                )}
            </Dialog>

        </Box>
    );
};

export default TaskList;
