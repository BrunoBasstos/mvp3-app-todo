// /src/components/TaskDialogForm.js

import React from 'react';
import {
    Autocomplete,
    TextField,
    MenuItem, Box, Typography,
} from "@mui/material";
import dayjs from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {toast, ToastContainer} from "react-toastify";
import ErrorToast from "./ErrorToast";

function CityAutocomplete(props) {
    let selectedCity = null;
    let cityOptions = props.cityOptions;
    // //if props.cityOptions is undefined, so, most likely, the api bridge lacks it's key
    if (props.cityOptions?.unique_id === null) {
        toast.error(<ErrorToast errors={["Erro ao buscar a cidade. Verifique a chave da API."]} />);
        cityOptions = [];
    } else {
        if (props.cityOptions.length === 0 && props.task?.cidade) {
            selectedCity = {unique_id: props.task.cidade};
        } else {
            // console.log("props.cityOptions", props.cityOptions.length, props.cityOptions, props.task?.cidade)
            selectedCity = props.cityOptions.find(city => city.unique_id === props.task?.cidade);
        }
    }

    return (
        <Autocomplete
            id="combo-box-autocomplete"
            options={cityOptions}
            value={selectedCity}
            getOptionLabel={(option) => option.unique_id}
            style={{marginTop: "12px"}}
            onChange={(e, value) => {
                props.setTask({...props.task, cidade: value.unique_id});
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label="Cidade"
                    onChange={(e) => props.handleCityInputChange(e.target.value)}
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
    );
}

function TaskDialogForm({task, setTask, prioridadesList, statusList, cityOptions, handleCityInputChange}) {
    return (
        <>
            <TextField
                autoFocus
                margin="dense"
                label="Título"
                fullWidth
                value={task.titulo}
                onChange={(e) => setTask({...task, titulo: e.target.value})}
            />
            <TextField
                margin="dense"
                label="Descrição"
                fullWidth
                value={task.descricao}
                onChange={(e) => setTask({...task, descricao: e.target.value})}
            />
            <TextField
                select
                margin="dense"
                label="Prioridade"
                fullWidth
                value={task.prioridade}
                onChange={(e) => setTask({...task, prioridade: e.target.value})}
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
                value={task.status}
                onChange={(e) => setTask({...task, status: e.target.value})}
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
                    value={dayjs(task.data_tarefa)}
                    onChange={(date) => setTask({...task, data_tarefa: date})}
                    renderInput={(params) => <TextField {...params} margin="dense"/>}
                />
            </LocalizationProvider>
            <CityAutocomplete
                cityOptions={cityOptions}
                handleCityInputChange={handleCityInputChange}
                task={task}
                setTask={setTask}

            />
        </>
    );
}

export default TaskDialogForm;
