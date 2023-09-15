// /src/components/TaskCard.js

import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Grid,
    Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudOffIcon from '@mui/icons-material/CloudOff';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';


function TaskCard({task, index, deleteTask, handleTaskClick, loggedUser}) {
    return (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
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
                                <Tooltip title={task.prioridade}>
                                    <DoubleArrowIcon
                                        fontSize="medium"
                                        color={task.prioridade === 'alta'
                                            ? 'error'
                                            : (task.prioridade === 'média'
                                                ? 'warning'
                                                : 'primary')}
                                    />
                                </Tooltip>
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
                            {(task.data_tarefa && new Date(task.data_tarefa) < new Date() || task.cidade === null || task?.data_conclusao) && (
                                <Grid item>
                                    <Tooltip
                                        title={task.data_conclusao ? 'Tarefa concluída' : (task.cidade === null ? 'Cidade não informada' : 'Tarefa vencida')}
                                    >
                                        <CloudOffIcon
                                            fontSize="medium"
                                            color={task.data_conclusao ? 'success' : (task.cidade === null ? 'error' : 'disabled')}
                                        />
                                    </Tooltip>
                                </Grid>
                            ) || (
                                <Grid
                                    item
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%"
                                    }}
                                >
                                    {task.weather?.error && (
                                        <Tooltip
                                            title={task.weather.error === "--" ? task.weather.error : `Error: ${task.weather.error}`}
                                        >
                                            <CloudOffIcon
                                                fontSize="medium"
                                                color="error"
                                            />
                                        </Tooltip>
                                    )}

                                    {task.weather?.forecast ? (
                                        task.weather.forecast.map((day, index) => (
                                            <Grid item key={index + '-' + day.dt} marginTop={"8px"}>
                                                <Typography variant="body2" fontSize={"11px"}>
                                                    {new Date(day.dt * 1000).toLocaleDateString()}
                                                </Typography>

                                                <Tooltip
                                                    key={day.dt}
                                                    title={`${day.description} - Temp: ${day.temp}°C`}>
                                                    <img
                                                        loading="lazy"
                                                        width="48"
                                                        src={`http://openweathermap.org/img/w/${day.icon}.png`}
                                                        alt={`${day.description}`}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        ))
                                    ) : (
                                        task?.weather && (
                                            <Grid item>
                                                <Typography variant="body2" fontSize={"11px"}>
                                                    Hoje
                                                </Typography>
                                                <Tooltip
                                                    key={task.weather.dt}
                                                    title={`${task.weather.description} - Temp: ${task.weather.temp}°C`}>
                                                    <img
                                                        loading="lazy"
                                                        width="48"
                                                        src={`http://openweathermap.org/img/w/${task.weather.icon}.png`}
                                                        alt={`${task.weather.description}`}
                                                        style={{marginLeft: "3px"}}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            )}
                        </Grid>

                        <Typography
                            variant="body2"
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
                            {task.descricao}
                        </Typography>
                        {(task.data_tarefa || task.cidade) && (
                            <Typography
                                variant="body2"
                                component="div"
                                noWrap
                                fontSize={"10px"}
                                fontStyle={"italic"}
                                marginTop={"8px"}
                                textAlign={"right"}
                            >
                                {task?.cidade ? task.cidade + ' - ' : ''}
                                {task?.data_tarefa ? new Date(task.data_tarefa).toLocaleDateString() : ''}
                            </Typography>
                        )}
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
                    </CardActions>
                </Card>
            )}
        </Draggable>
    );
}

export default TaskCard;
