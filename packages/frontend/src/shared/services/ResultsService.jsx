// src/shared/services/ResultsService.js
import useApi from "../hooks/useApi";
import usePartyService from "./PartyService";

const useResultsService = () => {
    const { doRequest } = useApi();
    const { getPartyDetails } = usePartyService(); // Obtener la función para detalles del partido

    /**
     * Función auxiliar para enriquecer las fórmulas con datos de presidente/vicepresidente.
     * Hace una llamada a getPartyDetails por cada fórmula para obtener la información adicional.
     * @param {Array} formulas - El array de fórmulas recibidas del endpoint de resultados.
     * @returns {Promise<Array>} El array de fórmulas enriquecido con presidente y vicepresidente.
     */
    const enrichFormulasWithCandidateDetails = async (formulas) => {
        if (!formulas || formulas.length === 0) {
            return [];
        }

        const enrichedFormulasPromises = formulas.map(async (formula) => {
            try {
                // Obtenemos los detalles del partido usando el nombre del partido
                const partyDetails = await getPartyDetails(formula.partido.nombre);

                // Mapeamos los candidatos del partido a presidente y vicepresidente
                const presidenteCandidato = partyDetails.candidatos.find(c => c.candidatura === 'Presidente');
                const vicepresidenteCandidato = partyDetails.candidatos.find(c => c.candidatura === 'Vicepresidente');

                return {
                    ...formula,
                    presidente: presidenteCandidato ? {
                        ci: presidenteCandidato.ci,
                        nombreCompleto: presidenteCandidato.nombreCompleto,
                        url: `/api/candidatos/${presidenteCandidato.ci}` // Ajusta la URL si es diferente
                    } : null,
                    vicepresidente: vicepresidenteCandidato ? {
                        ci: vicepresidenteCandidato.ci,
                        nombreCompleto: vicepresidenteCandidato.nombreCompleto,
                        url: `/api/candidatos/${vicepresidenteCandidato.ci}` // Ajusta la URL si es diferente
                    } : null,
                };
            } catch (error) {
                console.warn(`No se pudieron obtener detalles para el partido "${formula.partido.nombre}":`, error);
                // Si falla la obtención de detalles del partido, devolvemos la fórmula original
                // o con campos nulos para presidente/vicepresidente para no bloquear todo.
                return {
                    ...formula,
                    presidente: null, // O dejarlo como estaba si la API lo incluye pero vacío
                    vicepresidente: null, // O dejarlo como estaba
                };
            }
        });

        // Espera a que todas las promesas se resuelvan
        return Promise.all(enrichedFormulasPromises);
    };


    /**
     * Devuelve los resultados de una elección para un circuito específico.
     * GET /api/elecciones/{idEleccion}/circuitos/{numero}/resultados
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} numeroCircuito - El número del circuito.
     * @returns {Promise<object>} Los resultados del circuito con los datos enriquecidos.
     */
    const getCircuitElectionResults = async (idEleccion, numeroCircuito) => {
        const url = `elecciones/${idEleccion}/circuitos/${numeroCircuito}/resultados`;
        try {
            const response = await doRequest(url, 'GET', null, true);
            const results = response.data;

            // Enriquecer cada fórmula con los detalles de presidente y vicepresidente
            const enrichedPorFormula = await enrichFormulasWithCandidateDetails(results.votos.porFormula);

            return {
                ...results,
                votos: {
                    ...results.votos,
                    porFormula: enrichedPorFormula
                }
            };
        } catch (error) {
            console.error(`Error al obtener resultados del circuito ${numeroCircuito} para la elección ${idEleccion}:`, error);
            throw error;
        }
    };

    /**
     * Devuelve los resultados totales de una elección.
     * GET /api/elecciones/{idEleccion}/resultados
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} [departamento] - Opcional: Número del departamento para filtrar.
     * @returns {Promise<object>} Los resultados totales con los datos enriquecidos.
     */
    const getOverallElectionResults = async (idEleccion, departamento = null) => {
        let url = `elecciones/${idEleccion}/resultados`;
        if (departamento) {
            url += `?departamento=${departamento}`;
        }
        try {
            const response = await doRequest(url, 'GET', null, true);
            const results = response.data;

            // Enriquecer cada fórmula con los detalles de presidente y vicepresidente
            const enrichedPorFormula = await enrichFormulasWithCandidateDetails(results.votos.porFormula);

            return {
                ...results,
                votos: {
                    ...results.votos,
                    porFormula: enrichedPorFormula
                }
            };
        } catch (error) {
            console.error(`Error al obtener resultados totales de la elección ${idEleccion}:`, error);
            throw error;
        }
    };

    return {
        getCircuitElectionResults,
        getOverallElectionResults,
    };
};

export default useResultsService;