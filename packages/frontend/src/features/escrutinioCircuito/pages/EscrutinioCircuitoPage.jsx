// src/features/PanelAdmin/EscrutinioCircuito/pages/EscrutinioCircuitoPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useElection } from '../../../shared/context/EleccionContext'; 
import useResultsService from '../../../shared/services/ResultsService';

const EscrutinioCircuitoPage = () => {
    const [loading, setLoading] = useState(false);
    const [circuitResults, setCircuitResults] = useState(null);
    const navigate = useNavigate();
    const { getCircuitElectionResults, getOverallElectionResults } = useResultsService();
    const { electionInfo } = useElection(); // Obtener idEleccion y numeroCircuito del contexto

    // Usar idEleccionActual y numeroCircuitoActual del contexto
    const idEleccionActual = electionInfo.idEleccion;
    const numeroCircuitoActual = electionInfo.numeroCircuito;

    useEffect(() => {
        // Asegurarse de que ambos estén disponibles antes de intentar cargar
        if (!idEleccionActual || !numeroCircuitoActual) {
            setLoading(false);
            toast.warn('Información de elección o circuito no disponible para cargar resultados del circuito.');
            return;
        }

        const fetchCircuitResults = async () => {
            setLoading(true);
            try {
                const results = await getCircuitElectionResults(idEleccionActual, numeroCircuitoActual);
                setCircuitResults(results);
                toast.success(`Resultados del circuito ${numeroCircuitoActual} cargados.`);
            } catch (error) {
                toast.error(`Error al cargar resultados del circuito ${numeroCircuitoActual}.`);
                console.error("Error fetching circuit results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCircuitResults();
    }, [idEleccionActual, numeroCircuitoActual, getCircuitElectionResults]);

    const handleCheckEscrutinioTotal = async () => {
        setLoading(true);
        try {
            if (!idEleccionActual) {
                toast.warn('ID de elección no disponible para verificar escrutinio total.');
                setLoading(false);
                return;
            }
            const overallResults = await getOverallElectionResults(idEleccionActual);

            if (overallResults && overallResults.votos.total > 0) {
                toast.success('Escrutinio total disponible. Redirigiendo...');
                navigate('/EscrutinioFinal', { state: { overallResults } });
            } else {
                toast.info('El escrutinio total aún no está disponible o no hay datos. Intente de nuevo más tarde.');
            }

        } catch (error) {
            toast.error('Error al verificar el escrutinio total.');
            console.error("Error al verificar escrutinio total:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Escrutinio del Circuito {numeroCircuitoActual || '[Cargando...]'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Resultados preliminares del circuito actual.
            </Typography>

            {loading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                </Box>
            )}

            {!loading && circuitResults ? (
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                    <Typography variant="h6">Resumen del Circuito:</Typography>
                    <Typography>Votos Totales: {circuitResults.votos.total}</Typography>
                    <Typography>Votos Válidos: {circuitResults.votos.validos}</Typography>
                    <Typography>Votos en Blanco: {circuitResults.votos.blanco}</Typography>
                    <Typography>Votos Anulados: {circuitResults.votos.anulado}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Votos por Fórmula:</Typography>
                        {circuitResults.votos.porFormula.map((formula, index) => (
                            <Typography key={index} sx={{ ml: 2 }}>
                                - {formula.partido.nombre} ({formula.presidente?.nombreCompleto || 'N/A'} / {formula.vicepresidente?.nombreCompleto || 'N/A'}): {formula.votos} votos
                            </Typography>
                        ))}
                    </Box>
                </Box>
            ) : (
                !loading && <Typography>Cargando resultados del circuito o no disponibles...</Typography>
            )}

            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleCheckEscrutinioTotal}
                    disabled={loading || !isElectionInfoReady}
                >
                    Verificar Escrutinio Total
                </Button>
            </Box>
        </Container>
    );
};

export default EscrutinioCircuitoPage;