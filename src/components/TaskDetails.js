// /src/components/TaskDetails.js
// TaskDetails.js

import React from 'react';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function TaskDetails({ selectedTask, handleEdit, handleClose }) {
    if (!selectedTask) return null;

    return (
        <div>
            <DialogTitle>
                {selectedTask.titulo}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{selectedTask.descricao}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Fechar
                </Button>
                <Button onClick={handleEdit}>
                    Editar
                </Button>
            </DialogActions>
        </div>
    );
}

export default TaskDetails;
