// src/services/CorteService.js
import useApi from "../hooks/useApi";

const useCorteService = () => {
    const { doRequest } = useApi();

    /**
     * Obtiene una lista de todas las constancias de voto marcadas como observadas para una elección específica.
     * GET /api/elecciones/{idEleccion}/votos-observados
     * @param {number} idEleccion - El ID de la elección.
     * @returns {Promise<Array>} Un array de objetos de votos observados.
     */
    const getObservedVotes = async (idEleccion) => {
        try {
            const response = await doRequest(`elecciones/${idEleccion}/votos-observados`, "GET", null, true); // Requiere token
            return response.data.data; // Asumiendo que la respuesta es { "data": [...] }
        } catch (error) {
            console.error(`Error al obtener votos observados para la elección ${idEleccion}:`, error);
            throw error;
        }
    };

    /**
     * Confirma o anula un voto observado.
     * POST /api/elecciones/{idEleccion}/votos-observados/{ciVotante}
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} ciVotante - La CI del votante cuyo voto observado se va a procesar.
     * @param {"confirmar"|"anular"} accion - La acción a realizar ("confirmar" o "anular").
     * @returns {Promise<object>} Un mensaje de éxito del backend.
     */
    const confirmOrAnnulVote = async (idEleccion, ciVotante, accion) => {
        try {
            const response = await doRequest(
                `elecciones/${idEleccion}/votos-observados/${ciVotante}`,
                "POST",
                { accion: accion },
                true // Requiere token
            );
            return response.data;
        } catch (error) {
            console.error(`Error al ${accion} el voto observado del votante ${ciVotante}:`, error);
            throw error;
        }
    };

    return { getObservedVotes, confirmOrAnnulVote };
};

export default useCorteService;