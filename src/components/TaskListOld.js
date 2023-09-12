// /src/components/TaskList.js
import React, {useState, useEffect} from "react";
import {todoApi, bridgeApi} from "../axiosConfig";
import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    MenuItem,
    Tooltip,
} from "@mui/material";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {toast, ToastContainer} from "react-toastify";
import ErrorToast from "./ErrorToast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ErrorIcon from "@mui/icons-material/Error";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

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
    }, []);

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
        setTasks(response.data);

        let tmpTasks = response.data;
        for (const task of tmpTasks) {
            if (!task.cidade) continue;

            if (dayjs(task.data_tarefa).isBefore(dayjs(), "day")) {
                task.weather = {error: "--"}
                continue;
            }

            if (dayjs(task.data_tarefa).isSame(dayjs(), "day")) {
                const response = await bridgeApi.get(
                    `/weather/${task.cidade}`
                );
                if (response.status !== 200) {
                    task.weather = {error: response.data.message}
                    continue;
                }
                task.weather = response.data;
            }

            if (dayjs(task.data_tarefa).isAfter(dayjs(), "day")) {
                const response = await bridgeApi.get(
                    `/forecast/${task.cidade}`
                );
                if (response.status !== 200) {
                    task.weather = {error: response.data.message}
                    continue;
                }
                task.weather = response.data;
            }
        }
        setTasks(tmpTasks);
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
            <Typography variant="h4" align="center">
                Lista de Tarefas
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Adicionar Tarefa
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Adicionar Tarefa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Preencha os campos abaixo para adicionar uma nova tarefa.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        fullWidth
                        value={newTask.titulo}
                        onChange={(e) => setNewTask({...newTask, titulo: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        value={newTask.descricao}
                        onChange={(e) =>
                            setNewTask({...newTask, descricao: e.target.value})
                        }
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Prioridade"
                        fullWidth
                        value={newTask.prioridade}
                        onChange={(e) =>
                            setNewTask({...newTask, prioridade: e.target.value})
                        }
                    >
                        {prioridadesList.map((prioridade) => (
                            <MenuItem key={prioridade} value={prioridade}>
                                {prioridade}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Status"
                        fullWidth
                        style={{marginBottom: "12px"}}
                        value={newTask.status}
                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    >
                        {statusList.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Data da Tarefa"
                            value={dayjs(newTask.data_tarefa)}
                            onChange={(date) =>
                                setNewTask({...newTask, data_tarefa: date})
                            }
                        />
                    </LocalizationProvider>
                    <Autocomplete
                        options={cityOptions}
                        getOptionLabel={(option) => option.unique_id}
                        onChange={(e, value) => {
                            setIsSelectedCity(true);
                            setNewTask({...newTask, cidade: value.unique_id});
                        }}
                        onInputChange={(e, value) => {
                            handleCityInputChange(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Cidade"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                style={{marginTop: "12px"}}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                sx={{"& > img": {mr: 2, flexShrink: 0}}}
                                {...props}
                            >
                                <Box sx={{flexGrow: 1}}>
                                    <Typography variant="h6" component="h6" color="text.primary">
                                        {option.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        component="p"
                                        color="text.secondary"
                                    >
                                        {option.state}, {option.country}
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${option.country.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${option.country.toLowerCase()}.png 2x`}
                                            alt=""
                                            style={{marginLeft: "3px"}}
                                        />
                                    </Typography>
                                </Box>
                            </Box>
                        )}
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
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Grid container alignItems="center">
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        marginRight: "8px",
                                                                    }}
                                                                >
                                                                    {task.prioridade === "baixa" && (
                                                                        <Tooltip title={task.prioridade}>
                                                                            <LowPriorityIcon
                                                                                fontSize="medium"
                                                                                color="primary"
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                    {task.prioridade === "média" && (
                                                                        <Tooltip title={task.prioridade}>
                                                                            <PriorityHighIcon
                                                                                fontSize="medium"
                                                                                color="action"
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                    {task.prioridade === "alta" && (
                                                                        <Tooltip title={task.prioridade}>
                                                                            <ErrorIcon
                                                                                fontSize="medium"
                                                                                color="error"
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Typography
                                                                        variant="h6"
                                                                        component="div"
                                                                        noWrap
                                                                        sx={{
                                                                            textOverflow: "ellipsis",
                                                                            overflow: "hidden",
                                                                            maxHeight: "3em",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => handleTaskClick(task)}
                                                                    >
                                                                        {task.titulo}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        marginRight: "8px",
                                                                    }}
                                                                >
                                                                    {task.weather?.error && (
                                                                        task.weather.error === "--" ? (
                                                                            <Tooltip title={task.weather.error}>
                                                                                {/* show offline cloud icon */}
                                                                                <img
                                                                                    loading="lazy"
                                                                                    width="29"
                                                                                    src={`http://openweathermap.org/img/w/04d.png`}
                                                                                    alt={`${task.weather.error}`}
                                                                                    style={{marginLeft: "3px"}}
                                                                                />
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <Tooltip
                                                                                title={'teste:' + task.weather.error}>
                                                                                <ErrorIcon
                                                                                    fontSize="medium"
                                                                                    color="error"
                                                                                />
                                                                            </Tooltip>
                                                                        )
                                                                    )}
                                                                    {task.weather?.forecast ? (
                                                                        task.weather.forecast.map((day) => (
                                                                            <Tooltip
                                                                                key={day.dt}
                                                                                title={day.description}>
                                                                                <img
                                                                                    loading="lazy"
                                                                                    width="31"
                                                                                    src={`http://openweathermap.org/img/w/${day.icon}.png`}
                                                                                    alt={`${day.temp}`}
                                                                                    style={{marginLeft: "3px"}}
                                                                                />
                                                                            </Tooltip>
                                                                        ))
                                                                    ) : console.log("debug:: ", task) && (
                                                                        <Tooltip
                                                                            title={task.weather?.weather[0].description}>
                                                                            <img
                                                                                loading="lazy"
                                                                                width="32"
                                                                                src={`http://openweathermap.org/img/w/${task.weather?.weather[0].icon}.png`}
                                                                                alt={`${task.weather?.weather[0].temp}`}
                                                                                style={{marginLeft: "3px"}}
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                </Grid>
                                                            </Grid>
                                                            <Typography
                                                                variant="body2"
                                                                component="div"
                                                                noWrap
                                                                sx={{
                                                                    textOverflow: "ellipsis",
                                                                    overflow: "hidden",
                                                                    maxHeight: "3em", // Limite a altura para, por exemplo, 3 linhas
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => handleTaskClick(task)}
                                                            >
                                                                {task.descricao}
                                                            </Typography>
                                                        </CardContent>

                                                        <CardActions>
                                                            <Grid
                                                                container
                                                                alignItems="center"
                                                                sx={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                <Grid item>
                                                                    <Button
                                                                        size="small"
                                                                        color="secondary"
                                                                        onClick={() => deleteTask(task.id)}
                                                                    >
                                                                        Excluir
                                                                    </Button>
                                                                </Grid>
                                                                {loggedUser.perfil === "administrador" &&
                                                                    task.usuario.id !== loggedUser.id && (
                                                                        <>
                                                                            <Grid
                                                                                item
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    marginRight: "8px",
                                                                                }}
                                                                            >
                                                                                <Tooltip title={task.usuario.nome}>
                                                                                    <AccountCircleIcon
                                                                                        fontSize="small"/>
                                                                                </Tooltip>
                                                                            </Grid>
                                                                        </>
                                                                    )}
                                                            </Grid>
                                                            {/* ícone de usuário com o nome do dono da tarefa */}
                                                        </CardActions>
                                                    </Card>
                                                )}
                                            </Draggable>
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
                <DialogTitle>
                    {editMode ? (
                        <TextField
                            label="Título"
                            fullWidth
                            value={selectedTask.titulo}
                            onChange={(e) =>
                                setSelectedTask({...selectedTask, titulo: e.target.value})
                            }
                        />
                    ) : (
                        selectedTask?.titulo
                    )}
                </DialogTitle>
                <DialogContent>
                    {editMode ? (
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Descrição"
                                    multiline
                                    fullWidth
                                    value={selectedTask.descricao}
                                    onChange={(e) =>
                                        setSelectedTask({
                                            ...selectedTask,
                                            descricao: e.target.value,
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Prioridade"
                                    fullWidth
                                    value={selectedTask.prioridade}
                                    onChange={(e) =>
                                        setSelectedTask({
                                            ...selectedTask,
                                            prioridade: e.target.value,
                                        })
                                    }
                                >
                                    {prioridadesList.map((prioridade) => (
                                        <MenuItem key={prioridade} value={prioridade}>
                                            {prioridade}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Status"
                                    fullWidth
                                    value={selectedTask.status}
                                    onChange={(e) =>
                                        setSelectedTask({...selectedTask, status: e.target.value})
                                    }
                                >
                                    {statusList.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Data da Tarefa"
                                        value={dayjs(selectedTask.data_tarefa)}
                                        onChange={(date) =>
                                            setSelectedTask({
                                                ...selectedTask,
                                                data_tarefa: date,
                                            })
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={cityOptions}
                                    getOptionLabel={(option) => option.unique_id}
                                    onChange={(e, value) => {
                                        setIsSelectedCity(true);
                                        setSelectedTask({
                                            ...selectedTask,
                                            cidade: value.unique_id,
                                        });
                                    }}
                                    onInputChange={(e, value) => {
                                        handleCityInputChange(value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cidade"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            sx={{"& > img": {mr: 2, flexShrink: 0}}}
                                            {...props}
                                        >
                                            <Box sx={{flexGrow: 1}}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    color="text.primary"
                                                >
                                                    {option.name}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    component="p"
                                                    color="text.secondary"
                                                >
                                                    {option.state}, {option.country}
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        src={`https://flagcdn.com/w20/${option.country.toLowerCase()}.png`}
                                                        srcSet={`https://flagcdn.com/w40/${option.country.toLowerCase()}.png 2x`}
                                                        alt=""
                                                        style={{marginLeft: "3px"}}
                                                    />
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                />
                            </Grid>
                        </Grid>

                    ) : (
                        <DialogContentText>{selectedTask?.descricao}</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    {editMode ? (
                        <>
                            <Button onClick={handleCancelEdit} startIcon={<CancelIcon/>}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveEdit} startIcon={<SaveIcon/>}>
                                Salvar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleCloseDetails}>Fechar</Button>
                            <Button onClick={handleEditTask} startIcon={<EditIcon/>}>
                                Editar
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskList;
