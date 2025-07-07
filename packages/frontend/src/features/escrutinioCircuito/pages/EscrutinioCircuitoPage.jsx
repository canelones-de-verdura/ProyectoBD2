// src/features/PanelAdmin/EscrutinioCircuito/pages/EscrutinioCircuitoPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Importa useCallback
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
    const { electionInfo } = useElection();

    const idEleccionActual = electionInfo.idEleccion;
    // Usa 'numeroCircuito' que es el nombre consistente en el contexto
    const numeroCircuitoActual = electionInfo.numeroCircuito; 

    const fetchCircuitResults = useCallback(async () => {
        // Asegurarse de que ambos estén disponibles antes de intentar cargar
        if (idEleccionActual === null || numeroCircuitoActual === null) {
            // No mostrar toast.warn aquí cada vez que el componente se renderiza con valores nulos
            // El usuario ya sabe que la info no está disponible.
            console.log('Esperando información de elección o circuito...');
            return; 
        }

        setLoading(true);
        try {
            const results = await getCircuitElectionResults(idEleccionActual, numeroCircuitoActual);
            setCircuitResults(results);
            toast.success(`Resultados del circuito ${numeroCircuitoActual} cargados.`);
        } catch (error) {
            // El mensaje de error ahora proviene del servicio
            console.error("Error fetching circuit results:", error);
            setCircuitResults(null); // Limpiar resultados en caso de error
        } finally {
            setLoading(false);
        }
    }, [idEleccionActual, numeroCircuitoActual, getCircuitElectionResults]); // Dependencias

    // Este useEffect se ejecutará UNA SOLA VEZ cuando idEleccionActual y numeroCircuitoActual
    // tengan valores definidos (no null).
    // Si idEleccionActual o numeroCircuitoActual son null inicialmente, el `fetchCircuitResults`
    // no se ejecutará hasta que cambien a un valor no null.
    useEffect(() => {
        fetchCircuitResults();
    }, [fetchCircuitResults]); // Dependencia del useCallback

    // Memoiza handleCheckEscrutinioTotal con useCallback
    const handleCheckEscrutinioTotal = useCallback(async () => {
        setLoading(true);
        try {
            if (idEleccionActual === null) {
                toast.warn('ID de elección no disponible para verificar escrutinio total.');
                setLoading(false);
                return;
            }
            const overallResults = await getOverallElectionResults(idEleccionActual);

            // Asegúrate de que overallResults y overallResults.votos existan
            if (overallResults?.votos?.total > 0) { // Uso de optional chaining para seguridad
                toast.success('Escrutinio total disponible. Redirigiendo...');
                navigate('/EscrutinioFinal', { state: { overallResults } });
            } else {
                toast.info('El escrutinio total aún no está disponible o no hay datos. Intente de nuevo más tarde.');
            }

        } catch (error) {
            console.error("Error al verificar escrutinio total:", error);
        } finally {
            setLoading(false);
        }
    }, [idEleccionActual, getOverallElectionResults, navigate]); // Dependencias

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
                    <Typography>Votos Totales: {circuitResults.votos?.total || 0}</Typography> {/* Optional chaining */}
                    <Typography>Votos Válidos: {circuitResults.votos?.validos || 0}</Typography> {/* Optional chaining */}
                    <Typography>Votos en Blanco: {circuitResults.votos?.blanco || 0}</Typography> {/* Optional chaining */}
                    <Typography>Votos Anulados: {circuitResults.votos?.anulado || 0}</Typography> {/* Optional chaining */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Votos por Fórmula:</Typography>
                        {circuitResults.votos?.porFormula?.map((formula, index) => ( // Optional chaining
                            <Typography key={index} sx={{ ml: 2 }}>
                                - {formula.partido?.nombre} ({formula.presidente?.nombreCompleto || 'N/A'} / {formula.vicepresidente?.nombreCompleto || 'N/A'}): {formula.votos} votos
                            </Typography>
                        ))}
                    </Box>
                </Box>
            ) : (
                // Mostrar un mensaje diferente si la data no está lista pero no hay error
                !loading && (idEleccionActual === null || numeroCircuitoActual === null) ? (
                    <Typography>Por favor, asegúrese de que la elección y el circuito estén habilitados para ver los resultados.</Typography>
                ) : (
                    !loading && <Typography>No hay resultados disponibles para el circuito o ha ocurrido un error.</Typography>
                )
            )}

            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleCheckEscrutinioTotal}
                    disabled={loading}
                >
                    Verificar Escrutinio Total
                </Button>
            </Box>
        </Container>
    );
};

export default EscrutinioCircuitoPage;