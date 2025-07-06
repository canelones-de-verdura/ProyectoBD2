import React, { useState, useMemo } from 'react';
import { Container, Button, Box, TextField, InputAdornment, Checkbox, FormControlLabel, FormGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableComponent from '../../../../shared/components/TableComponent';
import { useNavigate } from 'react-router-dom';

const BuscarVotantesPage = () => {
    const [allVotersData, setAllVotersData] = useState([]); // Almacena TODOS los datos cargados (simulados o reales)
    const [searchTerm, setSearchTerm] = useState('');
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedVoterForAction, setSelectedVoterForAction] = useState(null);
    const [selectedVoteType, setSelectedVoteType] = useState('');

    const navigate = useNavigate();

    // Esta función simula la carga de TODOS los datos desde un "backend".
    // Ahora carga en 'allVotersData'
    const fetchAllSimulatedVoters = () => {
        const simulatedData = [
            { id: 1, credencial: 'AAA - 123456', cedula: '4.567.890-1', nombre: 'Juan Pérez', yaVoto: false },
            { id: 2, credencial: 'BBB - 654321', cedula: '1.234.567-8', nombre: 'Ana Gómez', yaVoto: false },
            { id: 3, credencial: 'AAA - 987654', cedula: '9.876.543-2', nombre: 'Carlos Ruiz', yaVoto: true },
            { id: 4, credencial: 'CCC - 112233', cedula: '3.333.333-3', nombre: 'María Lopez', yaVoto: false },
            { id: 5, credencial: 'BBB - 789012', cedula: '7.777.777-7', nombre: 'Pedro Diaz', yaVoto: true },
        ];
        setAllVotersData(simulatedData);
    };

    // Al hacer clic en buscar, primero cargamos todos los datos (si no están cargados)
    // y luego el useMemo se encargará de filtrarlos por el searchTerm.
    const handleSearchClick = () => {
        // En un caso real, aquí harías tu llamada API real
        // Si tu backend filtra, le pasas el searchTerm y el backend te devuelve los filtrados.
        // Si tu backend no filtra y siempre devuelve todo, entonces necesitas cargar todo una vez:
        if (allVotersData.length === 0) { // Cargar datos solo si no están cargados
             fetchAllSimulatedVoters();
        }
        // No hay necesidad de setear 'votantes' aquí, 'filteredVotantes' hará el trabajo
    };

    // *** MODIFICACIÓN CLAVE AQUÍ ***
    const filteredVotantes = useMemo(() => {
        // Si no hay término de búsqueda, o si no se han cargado datos aún,
        // la tabla estará vacía.
        if (!searchTerm || allVotersData.length === 0) {
            return []; // Retorna un array vacío para que la tabla se vea vacía
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return allVotersData.filter(votante =>
            votante.credencial.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [allVotersData, searchTerm]); // Dependencias: 'allVotersData' y 'searchTerm'


    const handleInitiateVote = (row, tipoVoto) => {
        setSelectedVoterForAction(row);
        setSelectedVoteType(tipoVoto);
        setOpenConfirmModal(true);
    };

    const handleConfirmVote = () => {
        setOpenConfirmModal(false);
        if (selectedVoterForAction) {
            // Actualiza el estado local para que el checkbox se marque y los botones se deshabiliten
            setAllVotersData(prevVoters =>
                prevVoters.map(voter =>
                    voter.id === selectedVoterForAction.id ? { ...voter, yaVoto: true } : voter
                )
            );

            navigate(`/votar/${selectedVoterForAction.id}/${selectedVoteType}`, {
                state: { voter: selectedVoterForAction, type: selectedVoteType }
            });
            setSelectedVoterForAction(null);
            setSelectedVoteType('');
        }
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
        setSelectedVoterForAction(null);
        setSelectedVoteType('');
    };

    const columns = [
        { nombre: 'Credencial', key: 'credencial' },
        { nombre: 'Cédula', key: 'cedula' },
        { nombre: 'Nombre', key: 'nombre' },
        {
            nombre: 'Ya Votó',
            key: 'yaVoto',
            render: (row) => (
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={row.yaVoto} disabled />}
                        label=""
                    />
                </FormGroup>
            ),
        },
        {
            nombre: 'Acción',
            key: 'accion',
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleInitiateVote(row, 'normal')}
                        size="small"
                        disabled={row.yaVoto}
                    >
                        Normal
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleInitiateVote(row, 'observado')}
                        size="small"
                        disabled={row.yaVoto}
                    >
                        Observado
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Container sx={{ mt: 4, width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
                <TextField
                    label="Buscar Credencial"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchClick();
                        }
                    }}
                    sx={{ width: '80%', maxWidth: '500px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    sx={{ ml: 2 }}
                >
                    Buscar
                </Button>
            </Box>

            <TableComponent
                columns={columns}
                data={filteredVotantes} // Usa los datos filtrados
                getRowId={(row) => row.id}
                selectable={false}
            />

            {/* Modal de Confirmación */}
            <Dialog
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">{"Confirmar Acción de Voto"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        ¿Confirma que desea iniciar el proceso de voto {selectedVoteType}
                        para {selectedVoterForAction?.nombre} (Cédula: {selectedVoterForAction?.cedula})?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmModal} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmVote} color="success" variant="contained" autoFocus>
                        Confirmar y Votar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BuscarVotantesPage;