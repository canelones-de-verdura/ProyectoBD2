// src/features/voto/pages/VotarPage.jsx (MODIFICADO)
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import usePartidosService from '../../../shared/services/PartidosService';
import useVotosService from '../../../shared/services/VotoService';
import { toast } from 'react-toastify';

const VotarPage = () => {
    const { votanteId, tipoVoto } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [voterInfo, setVoterInfo] = useState(location.state?.voter || null);
    const [partidos, setPartidos] = useState([]);
    const [loadingPartidos, setLoadingPartidos] = useState(true);
    const [selectedPartido, setSelectedPartido] = useState(null);
    const [voteConfirmationType, setVoteConfirmationType] = useState(null); // 'partido', 'blanco', 'anulado'
    const [openConfirmVoteModal, setOpenConfirmVoteModal] = useState(false);

    const { getAllPartidos } = usePartidosService();
    const { registerVote } = useVotosService(); // Usar el hook del servicio de votos

    useEffect(() => {
        // En un escenario real, si voterInfo no está en location.state (ej. al recargar),
        // deberías hacer una llamada a la API para obtener los datos del votante usando votanteId.
        // Por ahora, si no existe, redirigimos.
        if (!voterInfo) {
            toast.error("Información del votante no disponible. Redirigiendo a búsqueda.");
            navigate('/votantes');
            return;
        }

        const fetchPartidos = async () => {
            try {
                const data = await getAllPartidos();
                setPartidos(data);
                toast.success("Partidos cargados.");
            } catch (error) {
                console.error("Error al cargar partidos:", error);
                toast.error("Error al cargar partidos. Intente nuevamente.");
            } finally {
                setLoadingPartidos(false);
            }
        };

        fetchPartidos();
    }, [getAllPartidos, navigate, voterInfo]); // Asegúrate de que voterInfo esté en las dependencias si se usa aquí


    const handleSelectPartido = (partido) => {
        setSelectedPartido(partido);
        setVoteConfirmationType('partido');
        setOpenConfirmVoteModal(true);
    };

    const handleSelectBlanco = () => {
        setSelectedPartido(null); // Asegurar que no haya partido seleccionado
        setVoteConfirmationType('blanco');
        setOpenConfirmVoteModal(true);
    };

    const handleSelectAnulado = () => {
        setSelectedPartido(null); // Asegurar que no haya partido seleccionado
        setVoteConfirmationType('anulado');
        setOpenConfirmVoteModal(true);
    };

    const handleConfirmVote = async () => {
        setOpenConfirmVoteModal(false);

        if (!voterInfo) {
            toast.error("No hay información del votante para registrar el voto.");
            return;
        }

        const voteData = {
            ciVotante: voterInfo.id, // Usamos 'id' que mapeamos a 'ci' en BuscarVotantesPage
            observado: tipoVoto === 'observado', // 'true' si el tipoVoto es 'observado'
            voto: {}
        };

        if (voteConfirmationType === 'partido' && selectedPartido) {
            voteData.voto.tipo = "Valido";
            voteData.voto.nombrePartido = selectedPartido.nombre;
        } else if (voteConfirmationType === 'blanco') {
            voteData.voto.tipo = "Blanco";
        } else if (voteConfirmationType === 'anulado') {
            voteData.voto.tipo = "Anulado";
        } else {
            toast.error("Tipo de voto no válido o partido no seleccionado.");
            return;
        }

        try {
            // Llamada al servicio para registrar el voto en el backend
            await registerVote(voteData);

            toast.success(`Voto ${voteData.voto.tipo} para ${voterInfo.nombre} registrado exitosamente.`);

            // Redirigir de vuelta a la página de búsqueda de votantes
            // Pasamos un estado para indicar que un votante ha votado, lo cual puede disparar una recarga en BuscarVotantesPage
            navigate('/votantes', { state: { voterVotedCi: voterInfo.id } });

        } catch (error) {
            console.error("Error al registrar voto:", error);
            const errorMessage = error.response?.data?.error || "Error al registrar el voto. Intente nuevamente.";
            toast.error(errorMessage);
        } finally {
            // Limpiar estados después de la acción (éxito o fallo)
            setSelectedPartido(null);
            setVoteConfirmationType(null);
        }
    };

    const handleCloseConfirmVoteModal = () => {
        setOpenConfirmVoteModal(false);
        setSelectedPartido(null);
        setVoteConfirmationType(null);
    };

    if (loadingPartidos) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6">Cargando partidos...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Proceso de Voto {tipoVoto === 'normal' ? 'Normal' : 'Observado'}
            </Typography>
            <Typography variant="h5" gutterBottom>
                Votante: {voterInfo.nombre} (CI: {voterInfo.cedula})
            </Typography>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Seleccione un partido o tipo de voto:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                {partidos.length > 0 ? (
                    partidos.map((partido) => (
                        <Button
                            key={partido.nombre}
                            variant="contained"
                            size="large"
                            onClick={() => handleSelectPartido(partido)}
                            sx={{ minWidth: '150px', height: '80px', fontSize: '1.2rem' }}
                        >
                            {partido.nombre}
                        </Button>
                    ))
                ) : (
                    <Typography variant="body1">No se encontraron partidos.</Typography>
                )}

                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={handleSelectBlanco}
                    sx={{ minWidth: '150px', height: '80px', fontSize: '1.2rem' }}
                >
                    Voto Blanco
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={handleSelectAnulado}
                    sx={{ minWidth: '150px', height: '80px', fontSize: '1.2rem' }}
                >
                    Voto Anulado
                </Button>
            </Box>

            {/* Modal de Confirmación de Voto */}
            <Dialog
                open={openConfirmVoteModal}
                onClose={handleCloseConfirmVoteModal}
                aria-labelledby="confirm-vote-dialog-title"
                aria-describedby="confirm-vote-dialog-description"
            >
                <DialogTitle id="confirm-vote-dialog-title">{"Confirmar Voto"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-vote-dialog-description">
                        ¿Confirma el voto **{voteConfirmationType === 'partido' ? selectedPartido?.nombre : voteConfirmationType === 'blanco' ? 'Blanco' : 'Anulado'}**
                        de tipo **{tipoVoto}** para el votante **{voterInfo.nombre}** (CI: {voterInfo.cedula})?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmVoteModal} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmVote} color="success" variant="contained" autoFocus>
                        Confirmar Voto
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VotarPage;