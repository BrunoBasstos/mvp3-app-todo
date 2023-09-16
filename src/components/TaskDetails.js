// /src/components/TaskDetails.js
// TaskDetails.js

import React from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Grid,
    Tooltip
} from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

function TaskDetails({selectedTask, handleEdit, handleClose}) {
    if (!selectedTask) return null;

    return (
        <>
            <DialogTitle>
                <Grid container alignItems="center">
                    <Grid
                        item
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "8px",
                        }}
                    >
                        <Tooltip title={selectedTask.prioridade}>
                            <DoubleArrowIcon
                                fontSize="medium"
                                color={selectedTask.prioridade === 'alta'
                                    ? 'error'
                                    : (selectedTask.prioridade === 'média'
                                        ? 'warning'
                                        : 'primary')}
                            />
                        </Tooltip>

                    </Grid>
                    <Grid
                        item
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "8px",
                        }}
                    >
                        {selectedTask.titulo}
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid
                    item
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "8px",
                    }}
                >
                    {selectedTask.weather?.error && (
                        <Tooltip
                            title={selectedTask.weather.error === "--" ? selectedTask.weather.error : `Error: ${selectedTask.weather.error}`}
                        >
                            <CloudOffIcon
                                fontSize="medium"
                                color="error"
                            />
                        </Tooltip>
                    )}

                    {(selectedTask.data_tarefa && new Date(selectedTask.data_tarefa) < new Date() || selectedTask.cidade === null || selectedTask?.data_conclusao) && (
                        <Grid item>
                            <Tooltip
                                title={selectedTask.data_conclusao ? 'Tarefa concluída' : (selectedTask.cidade === null ? 'Cidade não informada' : 'Tarefa vencida ou sem data')}
                            >
                                <CloudOffIcon
                                    fontSize="medium"
                                    color={selectedTask.data_conclusao ? 'success' : (selectedTask.cidade === null ? 'error' : 'disabled')}
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
                            {selectedTask.weather?.error && (
                                <Tooltip
                                    title={selectedTask.weather.error === "--" ? selectedTask.weather.error : `Error: ${selectedTask.weather.error}`}
                                >
                                    <CloudOffIcon
                                        fontSize="medium"
                                        color="error"
                                    />
                                </Tooltip>
                            )}

                            {selectedTask.weather?.forecast ? (
                                selectedTask.weather.forecast.map((day, index) => (
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
                                selectedTask?.weather && (
                                    <Grid item>
                                        <Typography variant="body2" fontSize={"11px"}>
                                            Hoje
                                        </Typography>
                                        <Tooltip
                                            key={selectedTask.weather.dt}
                                            title={`${selectedTask.weather.description} - Temp: ${selectedTask.weather.temp}°C`}>
                                            <img
                                                loading="lazy"
                                                width="48"
                                                src={`http://openweathermap.org/img/w/${selectedTask.weather.icon}.png`}
                                                alt={`${selectedTask.weather.description}`}
                                                style={{marginLeft: "3px"}}
                                            />
                                        </Tooltip>
                                    </Grid>
                                )
                            )}
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogContent>
                <DialogContentText>{selectedTask.descricao}</DialogContentText>
                <DialogContentText
                    fontSize={"10px"}
                    fontStyle={"italic"}
                    marginTop={"8px"}
                    textAlign={"right"}
                >
                    {selectedTask?.cidade ? selectedTask.cidade + ' - ' : ''}
                    {selectedTask?.data_tarefa ? new Date(selectedTask.data_tarefa).toLocaleDateString() : ''}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Fechar
                </Button>
                <Button onClick={handleEdit}>
                    Editar
                </Button>
            </DialogActions>
        </>
    );
}

export default TaskDetails;
