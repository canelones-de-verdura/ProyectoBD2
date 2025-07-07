// src/features/PanelAdmin/cerrarcircuito/HabilitarPage.jsx (Anteriormente CerrarCircuitoPage)
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../../../shared/context/EleccionContext';
import useCircuitService from '../../../shared/services/CircuitService';

const CerrarCircuitoPage = () => { // Mantengo el nombre del componente como CerrarCircuitoPage para mayor claridad
    const [loading, setLoading] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const navigate = useNavigate();
    const { electionInfo, updateElectionInfo } = useElection(); // Usar el contexto
    const { closeCircuit } = useCircuitService(); // Usar el servicio para cerrar circuito

    // Comprobación para saber si tenemos la información necesaria
    const isElectionInfoReady = electionInfo.idEleccion !== null && electionInfo.numeroCircuito !== null;

    const handleOpenConfirmModal = () => {
        if (!isElectionInfoReady) {
            return;
        }
        setOpenConfirmModal(true);
    };

    const handleConfirmCerrar = async () => {
        setOpenConfirmModal(false);
        setLoading(true);

        const { idEleccion, numeroCircuito } = electionInfo; // Obtener del contexto

        try {
            const response = await closeCircuit(idEleccion, numeroCircuito); // Llama al servicio real

            // Opcional: Actualizar el estado del circuito en el contexto. Hacer???
            updateElectionInfo({ estadoCircuito: response.estado }); 

            navigate('/EscrutinioCircuito');

        } catch (error) {
            // Manejo de errores específicos del backend
            const errorMessage = error.response?.data?.detail || 'Error al cerrar el circuito. Intente de nuevo.';
            console.error("Error al cerrar circuito:", error);
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
                Cerrar Circuito
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                ¿Desea cerrar el circuito actual? Una vez cerrado, no se podrá volver atrás.
                Esta acción es irreversible.
                <br />
                {isElectionInfoReady ?
                    `Circuito: ${electionInfo.numeroCircuito}, Elección: ${electionInfo.idEleccion}` :
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
                Cerrar Circuito
            </Button>

            <Dialog
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-close-dialog-title"
                aria-describedby="confirm-close-dialog-description"
            >
                <DialogTitle id="confirm-close-dialog-title">{"Confirmar Cierre de Circuito"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-close-dialog-description">
                        Esta acción cerrará el Circuito: <Box component="span" fontWeight="bold">{electionInfo.numeroCircuito}</Box> de la Elección: <Box component="span" fontWeight="bold">{electionInfo.idEleccion}</Box> de forma permanente y redirigirá a la página de escrutinio.
                        <br /><br />
                        **¡ADVERTENCIA: Esta acción es irreversible!**
                        <br /><br />
                        ¿Está seguro que desea continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmModal} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmCerrar} color="primary" variant="contained" autoFocus>
                        Confirmar Cierre
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CerrarCircuitoPage;