// src/services/PartyService.js
import { useCallback } from 'react'; // Import useCallback
import useApi from "../hooks/useApi";

const usePartyService = () => {
    const { doRequest } = useApi();

    const getPartyDetails = useCallback(async (partyName) => {
        const encodedPartyName = encodeURIComponent(partyName);
        const url = `partidos/${encodedPartyName}`;
        try {
            const response = await doRequest(url, 'GET', null, true);
            return response; // Confirma que doRequest devuelve la data directamente
        } catch (error) {
            console.error(`Error al obtener detalles del partido "${partyName}":`, error);
            throw error;
        }
    }, [doRequest]); // doRequest es una dependencia

    return {
        getPartyDetails,
    };
};

export default usePartyService;