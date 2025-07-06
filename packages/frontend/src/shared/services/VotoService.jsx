// src/services/VotosService.js
import useApi from "../hooks/useApi";

const useVotosService = () => {
    const { doRequest } = useApi();

    /**
     * Registra la constancia de voto y el voto emitido para un ciudadano.
     * POST /api/votar
     * @param {object} voteData - Los datos del voto a registrar.
     * @param {number} voteData.ciVotante - La CI del votante.
     * @param {boolean} voteData.observado - Indica si el voto es observado.
     * @param {object} voteData.voto - Objeto con el tipo de voto y el partido (si es válido).
     * @param {"Valido"|"Blanco"|"Anulado"} voteData.voto.tipo - Tipo de voto.
     * @param {string} [voteData.voto.nombrePartido] - Nombre del partido (opcional, solo para tipo "Valido").
     * @returns {Promise<object>} La respuesta del backend después de registrar el voto.
     */
    const registerVote = async (voteData) => {
        try {
            const response = await doRequest("votar", "POST", voteData, true); // Requiere token
            return response.data; // Asumiendo que la respuesta es un mensaje de éxito, etc.
        } catch (error) {
            console.error("Error al registrar el voto:", error);
            throw error;
        }
    };

    return { registerVote };
};

export default useVotosService;