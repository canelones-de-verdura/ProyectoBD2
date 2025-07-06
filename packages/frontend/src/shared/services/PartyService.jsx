// src/services/PartyService.js
import useApi from "../hooks/useApi";
const usePartyService = () => {
    const { doRequest } = useApi();

    /**
     * Obtiene los detalles de un partido específico por su nombre.
     * GET /api/partidos/{nombre}
     * @param {string} partyName - El nombre del partido.
     * @returns {Promise<object>} Los detalles del partido, incluyendo presidente y vicepresidente.
     */
    const getPartyDetails = async (partyName) => {
        // Codifica el nombre del partido para la URL, ya que puede contener espacios o caracteres especiales.
        const encodedPartyName = encodeURIComponent(partyName);
        const url = `partidos/${encodedPartyName}`;
        try {
            const response = await doRequest(url, 'GET', null, true); // Asumiendo que requiere token
            return response.data; // Devuelve los detalles del partido
        } catch (error) {
            console.error(`Error al obtener detalles del partido "${partyName}":`, error);
            throw error; // Re-lanza el error para que el componente/servicio que llama lo maneje
        }
    };

    return {
        getPartyDetails,
    };
};

export default usePartyService;