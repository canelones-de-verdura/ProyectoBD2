// src/features/PanelAdmin/EscrutinioCircuito/pages/EscrutinioCircuitoPage.jsx
import React, { useState } from 'react';
import { Container, Typography, Box, Button, LinearProgress } from '@mui/material'; // Importamos Button y LinearProgress
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { toast } from 'react-toastify'; // Importamos toast

const EscrutinioCircuitoPage = () => {
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const navigate = useNavigate(); // Hook para la navegación

  // Función que simula la llamada al backend para verificar el escrutinio total
  const handleCheckEscrutinioTotal = async () => {
    setLoading(true); // Activa el loading
    try {
      // 🔧 Lógica real cuando tengas el servicio:
      // const response = await escrutinioService.checkEscrutinioTotal();
      // if (response.isAvailable) { // Suponiendo que el backend devuelve un campo 'isAvailable'
      //   toast.success('Escrutinio total disponible. Redirigiendo...');
      //   navigate('/EscrutinioFinal');
      // } else {
      //   toast.info('El escrutinio total aún no está disponible. Intente de nuevo más tarde.');
      // }

      // --- SIMULACIÓN ---
      await new Promise((r) => setTimeout(r, 2000)); // Simula un request de 2 segundos

      // Simula si el escrutinio total está disponible (cambia a 'true' o 'false' para probar)
      const escrutinioTotalDisponible = true; // <--- CÁMBIALO A FALSE PARA PROBAR EL MENSAJE DE NO DISPONIBLE

      if (escrutinioTotalDisponible) {
        toast.success('Escrutinio total disponible. Redirigiendo...');
        navigate('/EscrutinioFinal');
      } else {
        toast.info('El escrutinio total aún no está disponible. Intente de nuevo más tarde.');
      }
      // --- FIN SIMULACIÓN ---

    } catch (error) {
      toast.error('Error al verificar el escrutinio total.');
      console.error("Error al verificar escrutinio total:", error);
    } finally {
      setLoading(false); // Desactiva el loading
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Escrutinio del Circuito
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Aquí se mostrarán los resultados y el proceso de escrutinio del circuito.
        <br />
        (Esta es una página placeholder por ahora.)
      </Typography>

      {/* Indicador de carga */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        {/* Contenido del escrutinio del circuito (aquí irían los resultados parciales) */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resultados Parciales del Circuito:
        </Typography>
        <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: '4px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
          <Typography>Datos de escrutinio parcial aquí...</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCheckEscrutinioTotal}
          disabled={loading} // Deshabilita el botón mientras carga
        >
          Verificar Escrutinio Total
        </Button>
      </Box>
    </Container>
  );
};

export default EscrutinioCircuitoPage;