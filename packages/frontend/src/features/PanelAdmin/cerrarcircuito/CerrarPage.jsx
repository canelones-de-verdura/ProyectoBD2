import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    LinearProgress,
    Dialog,           // Importamos Dialog
    DialogActions,    // Importamos DialogActions
    DialogContent,    // Importamos DialogContent
    DialogContentText, // Importamos DialogContentText
    DialogTitle       // Importamos DialogTitle
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const CerrarCircuitoPage = () => {
    const [loading, setLoading] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false); // Estado para abrir/cerrar el modal de confirmación

    const navigate = useNavigate(); // Hook para la navegación

    // Función que se llama cuando se hace clic en el botón "Cerrar Circuito"
    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true); // Abre el modal de confirmación
    };

    // Función para manejar la confirmación dentro del modal
    const handleConfirmCerrar = async () => {
        setOpenConfirmModal(false); // Cierra el modal primero
        setLoading(true); // Activa el loading

        try {
            // 🔧 Lógica real cuando tengas el servicio para CERRAR el circuito:
            // await cerrarCircuitoService(); // Asumiendo que ahora es un servicio de 'cerrar'

            await new Promise((r) => setTimeout(r, 1500)); // Simula un request más largo

            toast.success('Circuito cerrado correctamente. Redirigiendo a Escrutinio...');
            // Después de un éxito simulado, redirige a /EscrutinioCircuito
            navigate('/EscrutinioCircuito');

        } catch (error) {
            toast.error('Error al cerrar el circuito. Por favor, intente de nuevo.');
            console.error("Error al cerrar circuito:", error);
        } finally {
            setLoading(false); // Desactiva el loading
        }
    };

    // Función para cerrar el modal sin confirmar
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
                onClick={handleOpenConfirmModal} // Llama a la función para abrir el modal
                disabled={loading} // Deshabilita el botón mientras carga
            >
                Cerrar Circuito
            </Button>

            {/* Modal de Confirmación */}
            <Dialog
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-close-dialog-title"
                aria-describedby="confirm-close-dialog-description"
            >
                <DialogTitle id="confirm-close-dialog-title">{"Confirmar Cierre de Circuito"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-close-dialog-description">
                        Esta acción cerrará el circuito de forma permanente y redirigirá a la página de escrutinio.
                        <br/><br/>
                        **¡ADVERTENCIA: Esta acción es irreversible!**
                        <br/><br/>
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