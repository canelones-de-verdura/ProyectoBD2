import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';

/**
 * Componente genérico para mostrar tablas, nosotros usamos por atrás MUI DataGrid.
 *
 * @param {Array} columns - Arreglo de objetos que definen las columnas.
 * @param {Array} data - Arreglo de objetos que representan las filas.
 * @param {Function} [getRowId] - Función para que vos le pases cual es la key de cada fila.
 */
const TableComponent = ({ columns, data, getRowId, setSelected }) => {
    const dataGridColumns = columns.map((col) => ({
        field: col.key,
        headerName: col.nombre,
        flex: 1,
        minWidth: 100,
        renderCell: col.render ? (params) => col.render(params.row) : undefined
    }));


    // En caso de que no se pase la función getRowId, usamos esta por defecto, medio fea pero funciona.
    const defaultGetRowId = (row, index) => row.id || index;

    return (
        <Paper elevation={2} sx={{ width: '100%', height: '100%', padding: 0 }}>
            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={dataGridColumns}
                    getRowId={getRowId || defaultGetRowId}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowSelectionModelChange={
                        (selection) => {
                            setSelected(selection)
                        }
                    }
                    //rowSelectionModel={selected}
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-cell': {
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                        },
                        '& .MuiDataGrid-root': {
                            height: '100%',
                        },
                    }}
                />
            </Box>
        </Paper>
    );
};

export default TableComponent;
