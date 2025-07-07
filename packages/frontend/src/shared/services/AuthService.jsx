// src/shared/services/AuthService.js (MODIFICADO POR ULTIMA VEZ)
import useApi from "../hooks/useApi";

const AuthService = () => {
    const { doRequest } = useApi();

    const login = async (ci, credencial) => {
        // Pasa solo 'login'. useApi se encargará de convertirlo en '/api/login'
        return doRequest('auth/login', 'POST', { ci, credencial });
    };

    const getCircuitDetailsByUrl = async (relativeUrl) => {
        // relativeUrl (ej. 'elecciones/1/circuitos/1') viene del backend SIN /api/
        // useApi se encargará de anteponer 'api/' a 'elecciones/1/circuitos/1'
        return doRequest(relativeUrl, 'GET', null, true);
    };

    // ... otros métodos
    return { login, getCircuitDetailsByUrl };
};

export default AuthService;