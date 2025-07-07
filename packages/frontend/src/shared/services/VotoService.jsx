// src/services/VotosService.js
import { useCallback } from 'react'; // Importa useCallback si aún no lo tienes
import useApi from "../hooks/useApi";
import { toast } from 'react-toastify';
import { useElection } from '../context/EleccionContext'; 

const useVotosService = () => {
    const { doRequest } = useApi();
    const { electionInfo } = useElection(); // Usa el hook para acceder a electionInfo

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
    const registerVote = useCallback(async (voteData) => {
        // Obtenemos idEleccion y numeroCircuito del contexto
        const { idEleccion, numeroCircuito } = electionInfo;

        if (idEleccion === null || numeroCircuito === null) {
            console.error("Error: idEleccion o numeroCircuito no están definidos en el contexto.");
            throw new Error("Información de elección y circuito no disponible.");
        }

        try {
            const url = `elecciones/${idEleccion}/circuitos/${numeroCircuito}/votar`;
            const response = await doRequest(url, "POST", voteData, true); // Requiere token
            return response.data; // Asumiendo que la respuesta es un mensaje de éxito, etc.
        } catch (error) {
            console.error("Error al registrar el voto:", error);
            throw error;
        }
    }, [doRequest, electionInfo]); // Agrega doRequest y electionInfo a las dependencias de useCallback

    return { registerVote };
};

export default useVotosService;