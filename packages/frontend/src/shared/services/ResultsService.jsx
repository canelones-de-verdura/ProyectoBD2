import { useCallback } from 'react';
import { toast } from 'react-toastify'; 
import useApi from "../hooks/useApi";
import usePartyService from "./PartyService";

const useResultsService = () => {
    const { doRequest } = useApi();
    const { getPartyDetails } = usePartyService();

    /**
     * Función auxiliar para enriquecer las fórmulas con datos de presidente/vicepresidente.
     * Hace una llamada a getPartyDetails por cada fórmula para obtener la información adicional.
     * @param {Array} formulas - El array de fórmulas recibidas del endpoint de resultados.
     * @returns {Promise<Array>} El array de fórmulas enriquecido con presidente y vicepresidente.
     */
    const enrichFormulasWithCandidateDetails = useCallback(async (formulas) => {
        if (!formulas || formulas.length === 0) {
            return [];
        }

        const enrichedFormulasPromises = formulas.map(async (formula) => {
            try {
                const partyDetails = await getPartyDetails(formula.partido.nombre);
                const presidenteCandidato = partyDetails?.candidatos?.find(c => c.candidatura === 'Presidente');
                const vicepresidenteCandidato = partyDetails?.candidatos?.find(c => c.candidatura === 'Vicepresidente');

                return {
                    ...formula,
                    presidente: presidenteCandidato ? {
                        ci: presidenteCandidato.ci,
                        nombreCompleto: presidenteCandidato.nombreCompleto,
                        url: `/api/candidatos/${presidenteCandidato.ci}`
                    } : null,
                    vicepresidente: vicepresidenteCandidato ? {
                        ci: vicepresidenteCandidato.ci,
                        nombreCompleto: vicepresidenteCandidato.nombreCompleto,
                        url: `/api/candidatos/${vicepresidenteCandidato.ci}`
                    } : null,
                };
            } catch (error) {
                const errorMessage = error.response?.data?.message || `Error al obtener detalles para el partido "${formula.partido.nombre}".`;
                console.warn(errorMessage, error);
                // Aquí usamos toast.warn en lugar de toast.error porque es un problema por fórmula,
                // no un fallo total del escrutinio. Se notificará, pero no detendrá la carga general.
                return {
                    ...formula,
                    presidente: null,
                    vicepresidente: null,
                };
            }
        });

        return Promise.all(enrichedFormulasPromises);
    }, [getPartyDetails]);


    /**
     * Devuelve los resultados de una elección para un circuito específico.
     * GET /api/elecciones/{idEleccion}/circuitos/{numero}/resultados
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} numeroCircuito - El número del circuito.
     * @returns {Promise<object>} Los resultados del circuito con los datos enriquecidos.
     */
    const getCircuitElectionResults = useCallback(async (idEleccion, numeroCircuito) => {
        const url = `elecciones/${idEleccion}/circuitos/${numeroCircuito}/resultados`;
        try {
            const response = await doRequest(url, 'GET', null, true);
            const results = response;

            // Asegúrate de que results.votos y results.votos.porFormula existen antes de intentar enriquecer
            const enrichedPorFormula = (results?.votos?.porFormula)
                ? await enrichFormulasWithCandidateDetails(results.votos.porFormula)
                : [];

            return {
                ...results,
                votos: {
                    ...results.votos,
                    porFormula: enrichedPorFormula
                }
            };
        } catch (error) {
            throw new Error(errorMessage);
        }
    }, [doRequest, enrichFormulasWithCandidateDetails]);

    /**
     * Devuelve los resultados totales de una elección.
     * GET /api/elecciones/{idEleccion}/resultados
     * @param {number} idEleccion - El ID de la elección.
     * @param {number} [departamento] - Opcional: Número del departamento para filtrar.
     * @returns {Promise<object>} Los resultados totales con los datos enriquecidos.
     */
    const getOverallElectionResults = useCallback(async (idEleccion, departamento = null) => {
        let url = `elecciones/${idEleccion}/resultados`;
        if (departamento) {
            url += `?departamento=${departamento}`;
        }
        try {
            const response = await doRequest(url, 'GET', null, true);
            const results = response;

            console.log(results)

            const enrichedPorFormula = (results?.votos?.porFormula)
                ? await enrichFormulasWithCandidateDetails(results.votos.porFormula)
                : [];

            return {
                ...results,
                votos: {
                    ...results.votos,
                    porFormula: enrichedPorFormula
                }
            };
        } catch (error) {
            throw new Error(error);
        }
    }, [doRequest, enrichFormulasWithCandidateDetails]);

    return {
        getCircuitElectionResults,
        getOverallElectionResults,
    };
};

export default useResultsService;