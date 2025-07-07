// src/shared/components/TableComponent.jsx
import React from 'react';
// Asegúrate de importar DataGrid desde @mui/x-data-grid
// Si usas DataGridPro, la importación sería de 'DataGridPro'
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material'; // Importa Box para envolver y dar altura

// Las 'columns' de DataGrid esperan una estructura específica
// con un 'field' y 'headerName'. Adaptaremos tus 'columns' a esto.

const TableComponent = ({ columns, data, getRowId, selectable }) => {
    // Mapea tus columnas personalizadas a la estructura esperada por DataGrid
    const dataGridColumns = columns.map(col => ({
        field: col.key, // 'field' es la clave para acceder al dato de la fila
        headerName: col.nombre, // 'headerName' es lo que se muestra en el encabezado
        flex: 1, // Permite que las columnas se expandan para llenar el espacio
        minWidth: 150, // Ancho mínimo para evitar que se contraigan demasiado
        sortable: true, // Habilita la ordenación
        filterable: true, // Habilita el filtro rápido si lo necesitas

        // Si tienes un 'render' prop, configúralo como 'renderCell'
        ...(col.render && {
            renderCell: (params) => col.render(params.row), // `params.row` contiene la fila completa
            sortable: false, // Las celdas renderizadas custom a menudo no son sortables por defecto
            filterable: false, // Ni filtrables directamente
            disableColumnMenu: true, // Deshabilita el menú de columna para estas celdas
        }),
    }));

    return (
        // Define una altura fija o máxima para el contenedor del DataGrid.
        // Esto es ESENCIAL para la virtualización.
        // Puedes ajustar la altura (ej. 600) según tus necesidades.
        <Box sx={{ height: 600, width: '100%', mt: 2 }}>
            <DataGrid
                rows={data} // DataGrid espera la prop 'rows'
                columns={dataGridColumns} // Usamos las columnas mapeadas
                getRowId={getRowId} // Pasamos la función para obtener el ID de cada fila
                checkboxSelection={selectable} // Para selección de filas
                disableRowSelectionOnClick // Mejora la accesibilidad y evita clicks accidentales
                // Configuración de paginación
                pageSizeOptions={[5, 10, 25, 50, 100]} // Opciones de cuántas filas por página
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 25 }, // Número de filas por página por defecto
                    },
                }}
                // Opcional: Deshabilitar características no usadas para optimizar
                disableColumnMenu={false} // Mantén si necesitas el menú de la columna (filtros, etc.)
                disableColumnSelector={true} // Oculta el selector de columnas si no se usa
                disableDensitySelector={true} // Oculta el selector de densidad si no se usa
                disableVirtualization={false} // Asegúrate de que esto NO sea 'true'
            />
        </Box>
    );
};

export default TableComponent;