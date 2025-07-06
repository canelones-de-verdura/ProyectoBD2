// src/services/AuthService.js
import useApi from "../hooks/useApi";

const useAuthService = () => {
    const { doRequest } = useApi();

    /**
     * Autentica a un presidente de mesa.
     * POST /api/auth/login
     * @param {number} ci - La cédula de identidad del presidente de mesa.
     * @param {string} credencial - La credencial del presidente de mesa (ej. "AAA 12345").
     * @returns {Promise<object>} Un objeto con el JWT y el objeto de circuito básico.
     */
    const login = async (ci, credencial) => { // Cambiamos 'email' y 'password' por 'ci' y 'credencial'
        const response = await doRequest(
            "auth/login", // Nuevo endpoint
            "POST",
            { ci: ci, credencial: credencial }, // Nuevo Request Body
            false // Asumiendo que esta llamada de login no requiere un token JWT para sí misma
        );
        return response; // Devolver la respuesta completa (incluye .data)
    };

    /**
     * Obtiene los detalles completos de un circuito utilizando su URL.
     * GET /api/elecciones/{idEleccion}/circuitos/{numero}
     * @param {string} circuitUrl - La URL del circuito proporcionada en la respuesta de login.
     * @returns {Promise<object>} Los detalles completos del circuito.
     */
    const getCircuitDetailsByUrl = async (circuitUrl) => {
        // doRequest ya maneja URLs relativas o completas si tu configuración de axios BaseURL es correcta.
        // Si tu circuitUrl ya viene completa (ej. "http://localhost:8000/api/elecciones/1/circuitos/1"),
        // asegúrate que doRequest lo maneje bien, o ajusta 'circuitUrl' para que sea relativa a tu BaseURL.
        // Asumo que circuitUrl es "/api/elecciones/1/circuitos/1" y doRequest lo combinará con tu BaseURL.
        const response = await doRequest(circuitUrl, 'GET', null, true); // Esta sí requiere token
        return response.data;
    };

    return { login, getCircuitDetailsByUrl };
};

export default useAuthService;