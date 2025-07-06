// src/features/PanelAdmin/EscrutinioFinal/pages/EscrutinioFinalPage.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const EscrutinioFinalPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Escrutinio Total Final
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        ¡El escrutinio total de todos los circuitos está disponible!
        <br />
        Aquí se mostrarán los resultados consolidados de la elección.
      </Typography>
      {/* Aquí irían los resultados finales, gráficos, etc. */}
      <Box sx={{ mt: 4 }}>
        {/* Contenido del escrutinio final */}
        <Typography>Resultados finales de la elección...</Typography>
      </Box>
    </Container>
  );
};

export default EscrutinioFinalPage;