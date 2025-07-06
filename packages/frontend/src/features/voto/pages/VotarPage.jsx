// src/features/PanelAdmin/votar/pages/VotarPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const VotarPage = () => {
    const { votanteId, tipoVoto } = useParams(); // Obtiene parámetros de la URL
    const location = useLocation(); // Obtiene el objeto location para acceder al 'state'
    const navigate = useNavigate();

    // Recupera la información del votante pasada a través del `state` de navegación
    const voter = location.state?.voter;

    const [selectedList, setSelectedList] = useState('');
    const [candidatos, setCandidatos] = useState([]); // Esto podría venir del backend
    const [listas, setListas] = useState([]); // Esto podría venir del backend

    // Simulamos la carga de datos de las listas y candidatos
    useEffect(() => {
        // En una aplicación real, aquí harías una llamada a tu backend
        // para obtener las listas de acuerdo a la mesa de votación, etc.
        const simulatedLists = [
            { id: 'lista1', nombre: 'Lista 100 - Frente Amplio', formula: 'Presidente: Mario Delgado | Vice: Laura Fernández' },
            { id: 'lista2', nombre: 'Lista 200 - Partido Nacional', formula: 'Presidente: Sofía Ruiz | Vice: Pablo Giménez' },
            { id: 'lista3', nombre: 'Lista 300 - Partido Colorado', formula: 'Presidente: Ricardo Bermejo | Vice: Ana Torres' },
            { id: 'lista4', nombre: 'Voto en blanco', formula: 'Sin candidatos' }, // Opción de voto en blanco
        ];
        setListas(simulatedLists);

        // Puedes simular también candidatos específicos si es necesario, aunque la "fórmula" ya los incluye
        const simulatedCandidatos = [
            // Ejemplos, no necesariamente conectados a las listas de arriba
            { id: 'cand1', nombre: 'Mario Delgado (FA)', listaId: 'lista1' },
            { id: 'cand2', nombre: 'Sofía Ruiz (PN)', listaId: 'lista2' },
        ];
        setCandidatos(simulatedCandidatos);

    }, []);

    const handleListSelectionChange = (event) => {
        setSelectedList(event.target.value);
    };

    const handleConfirmVote = () => {
        // Aquí iría la lógica para REGISTRAR el voto en tu backend
        // console.log(`Registrando voto para ${voter.nombre} (ID: ${voter.id})`);
        // console.log(`Tipo de voto: ${tipoVoto}`);
        // console.log(`Lista seleccionada: ${selectedList}`);

        // Por ahora, solo una alerta y luego redirigimos
        alert(`Voto '${tipoVoto}' registrado para ${voter.nombre} en la lista: ${selectedList || 'No seleccionada'}. ¡Simulación exitosa!`);

        // Después de registrar el voto, podrías redirigir al usuario de vuelta a la página de búsqueda
        navigate('/votantes'); // O a una página de confirmación de voto
    };

    if (!voter) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">
                    Error: Información del votante no disponible.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/votantes')}>
                    Volver a Buscar Votantes
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, width: '100%', maxWidth: '800px' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Emitir Voto
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                Votante: <Box component="span" fontWeight="bold">{voter.nombre}</Box> (Cédula: {voter.cedula})
            </Typography>
            <Typography variant="body1" gutterBottom>
                Tipo de Voto: <Box component="span" fontWeight="bold">{tipoVoto.toUpperCase()}</Box>
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Seleccione una Lista:
                </Typography>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                        aria-label="listas"
                        name="listas-radio-buttons-group"
                        value={selectedList}
                        onChange={handleListSelectionChange}
                    >
                        {listas.map((list) => (
                            <Box key={list.id} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: '4px' }}>
                                <FormControlLabel
                                    value={list.id}
                                    control={<Radio />}
                                    label={
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">{list.nombre}</Typography>
                                            <Typography variant="body2" color="text.secondary">{list.formula}</Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        ))}
                    </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => navigate('/votantes')} // Volver a la página anterior
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmVote}
                        disabled={!selectedList} // Deshabilitar si no hay lista seleccionada
                    >
                        Confirmar Voto
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VotarPage;