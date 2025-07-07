// src/features/corte/pages/CorteLoginPage.jsx
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useElection } from '../../../../shared/context/EleccionContext'; 

const CorteLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateElectionInfo } = useElection(); // Para establecer el idEleccion si es necesario

    const handleLogin = async () => {
        setLoading(true);
        try {
            // --- SIMULACIÓN DE LOGIN DE LA CORTE ---
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un delay

            if (username === 'corte' && password === 'corte123') {
                // En un escenario real, aquí el backend devolvería el idEleccion
                // o se asumiría uno global para la Corte.
                const simulatedElectionIdForCourt = 1; // Asumimos un ID de elección fijo para la Corte

                // Si la Corte opera sobre una elección específica, actualiza el contexto
                updateElectionInfo({ idEleccion: simulatedElectionIdForCourt }); // Solo idEleccion aquí, no numeroCircuito

                toast.success('Login de Corte exitoso!');
                navigate('/CorteDashboard'); // Redirige al dashboard de la Corte
            } else {
                throw new Error('Credenciales de Corte inválidas.');
            }
            // --- FIN SIMULACIÓN ---

        } catch (error) {
            console.error('Corte Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Login Miembro de la Corte
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
                </Button>
            </Box>
        </Container>
    );
};

export default CorteLoginPage;