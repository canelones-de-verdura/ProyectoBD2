// src/features/corte/pages/CorteDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableComponent from '../../../../shared/components/TableComponent';
import useCorteService from '../../../../shared/services/CorteService';
import { useElection } from '../../../../shared/context/EleccionContext'; 

const CorteDashboardPage = () => {
    const [observedVotes, setObservedVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [actionToPerform, setActionToPerform] = useState(null); // { ciVotante: number, accion: "confirmar" | "anular" }

    const navigate = useNavigate();
    const { getObservedVotes, confirmOrAnnulVote } = useCorteService();
    const { electionInfo } = useElection(); // Obtener idEleccion del contexto

    const idEleccion = electionInfo.idEleccion; // Usamos el ID de elección del contexto

    const fetchObservedVotes = useCallback(async () => {
        if (!idEleccion) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getObservedVotes(idEleccion);
            // Mapeamos los datos para que TableComponent los entienda y añadir un ID único si es necesario
            const mappedData = data.map(vote => ({
                id: vote.ciVotante, // Usar CI como ID para la tabla
                ciVotante: vote.ciVotante,
                numCircuito: vote.numCircuito,
                // Puedes añadir más campos si los necesitas para mostrar en la tabla (ej. nombre del votante)
                // Esto requeriría una llamada adicional a /api/votantes/{ci}
            }));
            setObservedVotes(mappedData);

            // Redirigir si la tabla está vacía
            if (mappedData.length === 0) {
                navigate('/EscrutinioFinal'); // Redirige a EscrutinioTotal
            }

        } catch (error) {
            console.error("Error fetching observed votes:", error);
        } finally {
            setLoading(false);
        }
    }, [idEleccion, getObservedVotes, navigate]);

    useEffect(() => {
        fetchObservedVotes();
    }, [fetchObservedVotes]); // Dependencia del callback para recargar

    const handleOpenConfirmModal = (ciVotante, accion) => {
        setActionToPerform({ ciVotante, accion });
        setOpenConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        setOpenConfirmModal(false);
        if (!actionToPerform || !idEleccion) {
            return;
        }

        const { ciVotante, accion } = actionToPerform;
        setLoading(true); // Activar loading durante la acción
        try {
            await confirmOrAnnulVote(idEleccion, ciVotante, accion);
            toast.success(`Voto observado del CI ${ciVotante} ha sido ${accion === 'confirmar' ? 'confirmado' : 'anulado'} exitosamente.`);
            // Refrescar la lista después de la acción exitosa
            fetchObservedVotes();
        } catch (error) {
            const errorMessage = error.response?.data?.error || `Error al ${accion} el voto observado.`;
            console.error(`Error al ${accion} voto observado:`, error);
        } finally {
            setLoading(false); // Desactivar loading
            setActionToPerform(null);
        }
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
        setActionToPerform(null);
    };

    const columns = [
        { nombre: 'CI Votante', key: 'ciVotante' },
        { nombre: 'Número Circuito', key: 'numCircuito' },
        {
            nombre: 'Acción',
            key: 'accion',
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => handleOpenConfirmModal(row.ciVotante, 'confirmar')}
                        disabled={loading} // Deshabilitar botones mientras se procesa una acción
                    >
                        Confirmar
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleOpenConfirmModal(row.ciVotante, 'anular')}
                        sx={{ ml: 1 }}
                        disabled={loading} // Deshabilitar botones mientras se procesa una acción
                    >
                        Anular
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Votos Observados (Corte)
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Lista de votos observados pendientes de confirmación o anulación.
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Cargando votos observados...</Typography>
                </Box>
            ) : (
                <TableComponent
                    columns={columns}
                    data={observedVotes}
                    getRowId={(row) => row.id}
                    selectable={false}
                />
            )}

            {/* Modal de Confirmación para Confirmar/Anular */}
            <Dialog
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-action-dialog-title"
                aria-describedby="confirm-action-dialog-description"
            >
                <DialogTitle id="confirm-action-dialog-title">
                    {actionToPerform?.accion === 'confirmar' ? "Confirmar Voto Observado" : "Anular Voto Observado"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-action-dialog-description">
                        ¿Está seguro que desea **{actionToPerform?.accion}** el voto observado del votante con CI **{actionToPerform?.ciVotante}**?
                        Esta acción es irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmModal} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAction} color="primary" variant="contained" autoFocus>
                        {actionToPerform?.accion === 'confirmar' ? "Confirmar" : "Anular"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CorteDashboardPage;