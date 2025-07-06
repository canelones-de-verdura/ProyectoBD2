import React, { useState } from 'react';
import { Container, Typography, Button, Box, LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';

const HabilitarCircuitoPage = () => {
  const [loading, setLoading] = useState(false);

  const handleHabilitar = async () => {
    setLoading(true);
    try {
      // 🔧 Lógica real cuando tengas el servicio:
      // await habilitarCircuitoService();

      await new Promise((r) => setTimeout(r, 1000)); // Simula request

      toast.success('Circuito habilitado correctamente');
    } catch (error) {
      toast.error('Error al habilitar el circuito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Habilitación de Circuito
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        ¿Desea habilitar el circuito actual? Una vez habilitado, quedará disponible para operaciones electorales.
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
        onClick={handleHabilitar}
        disabled={loading}
      >
        Habilitar Circuito
      </Button>
    </Container>
  );
};

export default HabilitarCircuitoPage;
