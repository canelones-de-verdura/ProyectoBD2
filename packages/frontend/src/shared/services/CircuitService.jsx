// src/services/circuitService.js
import useApi from "../hooks/useApi";

const useCircuitService = () => {
    const { doRequest } = useApi();

    /**
     * Abre un circuito electoral.
     * POST /api/elecciones/{idEleccion}/circuitos/{numero}/abrir
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} numeroCircuito - El número del circuito.
     * @returns {Promise<object>} El objeto del circuito actualizado con el estado "abierto".
     */
    const openCircuit = async (idEleccion, numeroCircuito) => {
        const url = `elecciones/${idEleccion}/circuitos/${numeroCircuito}/abrir`;
        try {
            // El endpoint es POST y no necesita data en el body.
            const response = await doRequest(url, 'POST', {}, true); 
            return response.data; // Devuelve solo la data de la respuesta
        } catch (error) {
            console.error(`Error al abrir el circuito ${numeroCircuito} para la elección ${idEleccion}:`, error);
            throw error; // Re-lanza el error para que el componente lo maneje
        }
    };

    /**
     * Cierra un circuito electoral.
     * POST /api/elecciones/{idEleccion}/circuitos/{numero}/cerrar
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} numeroCircuito - El número del circuito.
     * @returns {Promise<object>} El objeto del circuito actualizado con el estado "cerrado".
     */
    const closeCircuit = async (idEleccion, numeroCircuito) => {
        const url = `elecciones/${idEleccion}/circuitos/${numeroCircuito}/cerrar`;
        try {
            // El endpoint es POST y no necesita data en el body.
            const response = await doRequest(url, 'POST', {}, true); // Asumiendo que requiere token
            return response; // Devuelve solo la data de la respuesta
        } catch (error) {
            console.error(`Error al cerrar el circuito ${numeroCircuito} para la elección ${idEleccion}:`, error);
            throw error; // Re-lanza el error para que el componente lo maneje
        }
    };

    return {
        openCircuit,
        closeCircuit,
    };
};

export default useCircuitService;