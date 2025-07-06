// src/features/PanelAdmin/EscrutinioFinal/pages/EscrutinioFinalPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, LinearProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useElection } from '../../../shared/context/EleccionContext';
import useResultsService from '../../../shared/services/ResultsService';

const EscrutinioFinalPage = () => {
    const [loading, setLoading] = useState(true);
    const [overallResults, setOverallResults] = useState(null);
    const location = useLocation();
    const { getOverallElectionResults } = useResultsService();
    const { electionInfo } = useElection(); // Obtener idEleccion del contexto

    // Usar idEleccionActual del contexto
    const idEleccionActual = electionInfo.idEleccion;

    useEffect(() => {
        // Asegurarse de que el idEleccion esté disponible antes de intentar cargar
        if (!idEleccionActual) {
            setLoading(false);
            toast.warn('ID de elección no disponible para cargar resultados finales.');
            return;
        }

        const resultsFromState = location.state?.overallResults;

        if (resultsFromState) {
            setOverallResults(resultsFromState);
            setLoading(false);
            toast.success('Resultados totales cargados desde la navegación.');
        } else {
            const fetchOverallResults = async () => {
                try {
                    const results = await getOverallElectionResults(idEleccionActual);
                    setOverallResults(results);
                    toast.success('Resultados totales cargados del backend.');
                } catch (error) {
                    toast.error('Error al cargar los resultados totales.');
                    console.error("Error fetching overall results:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOverallResults();
        }
    }, [idEleccionActual, getOverallElectionResults, location.state]);

    return (
        <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Escrutinio Total Final
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Resultados consolidados de la elección.
            </Typography>

            {loading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                </Box>
            )}

            {!loading && overallResults ? (
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                    <Typography variant="h6">Resumen Total de la Elección:</Typography>
                    <Typography>Votos Totales: {overallResults.votos.total}</Typography>
                    <Typography>Votos Válidos: {overallResults.votos.validos}</Typography>
                    <Typography>Votos en Blanco: {overallResults.votos.blanco}</Typography>
                    <Typography>Votos Anulados: {overallResults.votos.anulado}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Votos por Fórmula:</Typography>
                        {overallResults.votos.porFormula.map((formula, index) => (
                            <Typography key={index} sx={{ ml: 2 }}>
                                - {formula.partido.nombre} ({formula.presidente?.nombreCompleto || 'N/A'} / {formula.vicepresidente?.nombreCompleto || 'N/A'}): {formula.votos} votos
                            </Typography>
                        ))}
                    </Box>
                </Box>
            ) : (
                !loading && <Typography>Cargando resultados finales o no disponibles...</Typography>
            )}
        </Container>
    );
};

export default EscrutinioFinalPage;