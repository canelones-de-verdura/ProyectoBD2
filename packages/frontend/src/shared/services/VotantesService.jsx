// src/services/VotantesService.js
import useApi from "../hooks/useApi";

const useVotantesService = () => {
    const { doRequest } = useApi();

    /**
     * Obtiene todos los votantes del sistema.
     * GET /api/votantes
     * @returns {Promise<Array>} Un array de objetos de votante con info básica y URL.
     */
    const getAllVotantes = async () => {
        try {
            const response = await doRequest("votantes", "GET", null, true); // Requiere token
            return response.data.data; // Asumiendo que la respuesta es { "data": [...] }
        } catch (error) {
            console.error("Error al obtener votantes:", error);
            throw error;
        }
    };

    /**
     * Obtiene los detalles de un votante específico por su CI.
     * GET /api/votantes/{ci}
     * @param {number} ci - La cédula de identidad del votante.
     * @returns {Promise<object>} Los detalles completos del votante.
     */
    const getVotanteByCi = async (ci) => {
        try {
            const response = await doRequest(`votantes/${ci}`, "GET", null, true); // Requiere token
            return response.data; // Asumiendo que la respuesta es el objeto votante directamente
        } catch (error) {
            console.error(`Error al obtener votante con CI ${ci}:`, error);
            throw error;
        }
    };

    return { getAllVotantes, getVotanteByCi };
};

export default useVotantesService;