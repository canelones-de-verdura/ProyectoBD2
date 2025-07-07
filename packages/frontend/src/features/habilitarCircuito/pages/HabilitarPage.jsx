// src/features/habilitarCircuito/pages/HabilitarPage.jsx
import React, { useState } from 'react';
import { Container, Typography, Button, Box, LinearProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useElection } from '../../../shared/context/EleccionContext';
import useCircuitService from '../../../shared/services/CircuitService';

const HabilitarCircuitoPage = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const { electionInfo, updateElectionInfo } = useElection(); // Usar el contexto
    const { openCircuit } = useCircuitService(); // Usar el servicio para abrir circuito

    // Comprobación para saber si tenemos la información necesaria
    const isElectionInfoReady = electionInfo.idEleccion !== null && electionInfo.numero !== null;

    const handleOpenConfirmModal = () => {
        if (!isElectionInfoReady) {
            return;
        }
        setOpenConfirmModal(true);
    };

    const handleConfirmHabilitar = async () => {
        setOpenConfirmModal(false);
        setLoading(true);

        const { idEleccion, numero } = electionInfo; // Obtener del contexto

        try {
            const response = await openCircuit(idEleccion, numero); // Llama al servicio real

            navigate('/votantes');


        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Error al habilitar el circuito. Intente de nuevo.';
        } finally {
            setLoading(false);
        }
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Habilitación de Circuito
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                ¿Desea habilitar el circuito actual? Una vez habilitado, quedará disponible para operaciones electorales.
                <br />
                {isElectionInfoReady ?
                    `Circuito: ${electionInfo.numero}, Elección: ${electionInfo.idEleccion}` :
                    <Typography color="warning.main" variant="caption">Información de elección/circuito no cargada.</Typography>
                }
            </Typography>

            {loading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                </Box>
            )}

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOpenConfirmModal}
                disabled={loading || !isElectionInfoReady}
            >
                Habilitar Circuito
            </Button>

            <Dialog
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-enable-dialog-title"
                aria-describedby="confirm-enable-dialog-description"
            >
                <DialogTitle id="confirm-enable-dialog-title">{"Confirmar Habilitación de Circuito"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-enable-dialog-description">
                        ¿Confirma que desea habilitar el Circuito: <Box component="span" fontWeight="bold">{electionInfo.numero}</Box> para la Elección: <Box component="span" fontWeight="bold">{electionInfo.idEleccion}</Box>?
                        <br /><br />
                        Esta acción permitirá el inicio de las operaciones de voto en este circuito.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmModal} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmHabilitar} color="success" variant="contained" autoFocus>
                        Confirmar Habilitación
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HabilitarCircuitoPage;