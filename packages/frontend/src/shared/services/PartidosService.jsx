// src/services/PartidosService.js
import useApi from "../hooks/useApi";

const usePartidosService = () => {
    const { doRequest } = useApi();

    /**
     * Obtiene todos los partidos disponibles.
     * GET /api/partidos
     * @returns {Promise<Array>} Un array de objetos de partido.
     */
    const getAllPartidos = async () => {
        try {
            const response = await doRequest("partidos", "GET", null, true); // Requiere token
            return response.data.data; // Asumiendo que la respuesta es { "data": [...] }
        } catch (error) {
            console.error("Error al obtener partidos:", error);
            throw error;
        }
    };

    return { getAllPartidos };
};

export default usePartidosService;