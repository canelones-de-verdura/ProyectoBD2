// src/features/PanelAdmin/BuscarVotante/pages/BuscarVotantesPage.jsx (AJUSTADO)
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Container, Button, Box, TextField, InputAdornment, Checkbox, FormControlLabel, FormGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableComponent from '../../../../shared/components/TableComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import useVotantesService from '../../../../shared/services/VotantesService';
import { useElection } from '../../../../shared/context/EleccionContext';
import { toast } from 'react-toastify';

const BuscarVotantesPage = () => {
    const [allVotersData, setAllVotersData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedVoterForAction, setSelectedVoterForAction] = useState(null);
    const [selectedVoteType, setSelectedVoteType] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { getAllVotantes } = useVotantesService();
    // NO NECESITAMOS EL HOOK DEL SERVICIO DE CIRCUITOS AQUÍ
    // const { getCredencialRangesByCircuit } = useCircuitosService();
    const { electionInfo } = useElection();

    // Acceder directamente a los rangos y otra información del circuito desde electionInfo
    const idEleccion = electionInfo.idEleccion;
    const numeroCircuito = electionInfo.numeroCircuito;
    const rangoInicioCred = electionInfo.rangoInicioCred; // <-- OBTENEMOS ESTO DEL CONTEXTO
    const rangoFinCred = electionInfo.rangoFinCred;     // <-- OBTENEMOS ESTO DEL CONTEXTO


    const fetchAllVotersFromApi = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllVotantes();
            const mappedData = data.map(votante => ({
                id: votante.ci,
                credencial: votante.credencial,
                cedula: votante.ci,
                nombre: votante.nombreCompleto,
                yaVoto: votante.yaVoto || false,
                url: votante.url
            }));
            setAllVotersData(mappedData);
        } catch (error) {
            console.error("Error al cargar votantes:", error);
            toast.error("Error al cargar votantes. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    }, [getAllVotantes]);


    // ELIMINAR ESTE useEffect YA NO ES NECESARIO PARA LOS RANGOS
    /*
    useEffect(() => {
        const loadCredencialRanges = async () => {
            if (idEleccion && numeroCircuito) {
                try {
                    const ranges = await getCredencialRangesByCircuit(idEleccion, numeroCircuito);
                    setCredencialRanges(ranges);
                } catch (error) {
                    console.error("Error al obtener los rangos de credenciales:", error);
                    setCredencialRanges(null);
                    toast.error("No se pudieron cargar los rangos de credenciales del circuito.");
                }
            } else {
                setCredencialRanges(null);
            }
        };

        loadCredencialRanges();
    }, [idEleccion, numeroCircuito, getCredencialRangesByCircuit]);
    */


    useEffect(() => {
        fetchAllVotersFromApi();
    }, [location.state?.voterVotedCi, fetchAllVotersFromApi]);

    const handleSearchClick = () => {
        // ... (sin cambios)
    };

    const filteredVotantes = useMemo(() => {
        if (!searchTerm) {
            return allVotersData;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return allVotersData.filter(votante =>
            votante.credencial.toLowerCase().includes(lowerCaseSearchTerm) ||
            String(votante.cedula).includes(lowerCaseSearchTerm) ||
            votante.nombre.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [allVotersData, searchTerm]);

    const handleInitiateVote = (row, tipoVoto) => {
        setSelectedVoterForAction(row);
        setSelectedVoteType(tipoVoto);
        setOpenConfirmModal(true);
    };

    const handleConfirmVote = () => {
        setOpenConfirmModal(false);
        if (selectedVoterForAction) {
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
                        disabled={row.yaVoto || loading}
                    >
                        Normal
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleInitiateVote(row, 'observado')}
                        size="small"
                        disabled={row.yaVoto || loading}
                    >
                        Observado
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Container sx={{ mt: 4, width: '100%' }}>
            <Typography variant="h5" gutterBottom align="center">
                Búsqueda de Votantes
            </Typography>

            {/* Mostrar Rangos de Credenciales (AHORA DIRECTO DEL CONTEXTO) */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Rango de Credenciales para este Circuito:
                </Typography>
                {idEleccion && numeroCircuito ? (
                    rangoInicioCred && rangoFinCred ? ( // Verificar que los rangos existen en el contexto
                        <Typography variant="body1" align="center">
                            **Desde:** {rangoInicioCred} - **Hasta:** {rangoFinCred}
                        </Typography>
                    ) : (
                        <Typography variant="body2" align="center" color="textSecondary">
                            Rangos de credenciales no disponibles para el Circuito {numeroCircuito}.
                        </Typography>
                    )
                ) : (
                    <Typography variant="body2" align="center" color="textSecondary">
                        Información de Elección o Circuito no disponible. Por favor, asegúrese de que el circuito esté habilitado.
                    </Typography>
                )}
            </Box>


            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
                <TextField
                    label="Buscar Credencial, Cédula o Nombre"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            // handleSearchClick();
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableComponent
                    columns={columns}
                    data={filteredVotantes}
                    getRowId={(row) => row.id}
                    selectable={false}
                />
            )}

            {/* Modal de Confirmación (sin cambios) */}
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