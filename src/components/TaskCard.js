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
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ErrorIcon from "@mui/icons-material/Error";

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
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: "8px",
                                }}
                            >
                                {task.weather?.error && (
                                    task.weather.error === "--" ? (
                                        <Tooltip title={task.weather.error}>
                                            <img
                                                loading="lazy"
                                                width="48"
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
                                    task.weather.forecast.map((day, index) => (
                                        <Grid container xs={3} alignItems={"center"} spacingX={2} key={index + '' + day.dt}>
                                            <Grid item>
                                                <Typography variant="body2" fontSize={"11px"}>
                                                    {new Date(day.dt * 1000).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip
                                                    key={day.dt}
                                                    title={`${day.description} - Temp: ${day.temp}°C`}>
                                                    <img
                                                        loading="lazy"
                                                        width="48"
                                                        src={`http://openweathermap.org/img/w/${day.icon}.png`}
                                                        alt={`${day.description}`}
                                                        style={{marginLeft: "3px"}}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    ))
                                ) : (
                                    task.weather?.weather && (
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="body2">
                                                    Hoje
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip
                                                    title={`${task.weather?.weather[0].description} - Temp: ${task.weather?.weather[0].temp}°C`}>
                                                    <img
                                                        loading="lazy"
                                                        width="48"
                                                        src={`http://openweathermap.org/img/w/${task.weather?.weather[0].icon}.png`}
                                                        alt={`${task.weather?.weather[0].description}`}
                                                        style={{marginLeft: "3px"}}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    )
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
                                maxHeight: "3em",
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
                    </CardActions>
                </Card>
            )}
        </Draggable>
    );
}

export default TaskCard;
