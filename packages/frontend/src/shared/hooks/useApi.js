// src/shared/hooks/useApi.js (VERSION FINAL PARA DOBLE BARRA)
import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Opciones para API_BASE_URL:
// 1. Si tu backend corre en un puerto diferente (ej. 8080) y NO usas un proxy:
//    const API_BASE_URL = 'http://localhost:8080';
// 2. Si tu frontend dev server (en 3000) usa un PROXY para /api (lo más común y recomendable):
//    const API_BASE_URL = ''; // String vacío para que Axios use la URL relativa que el proxy intercepte
//    (Este es el que usaremos en el ejemplo final si el backend REALMENTE recibe /api/login)

// Basado en que tu frontend corre en 3000 y el error te da 3000//api/login
// lo más probable es que necesites un proxy o que el backend esté en 3000.
// Si el backend *realmente* está en localhost:3000 y atiende /api/login,
// entonces la configuración de '' o '/' como API_BASE_URL es la correcta.
// Dado el error, apostemos por la configuración de proxy (API_BASE_URL = '') y que Vite lo maneje.

const API_BASE_URL = 'http://localhost:3000'

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const doRequest = useCallback(async (endpoint, method = 'GET', data = {}, requiresAuth = false) => {
        setLoading(true);
        setError(null);

        // Limpia las barras para evitar http://localhost:3000//api/login
        // Si API_BASE_URL es '', el endpoint debe empezar con '/'
        // Si API_BASE_URL es 'http://localhost:8080', el endpoint debe empezar con '/'
        // Queremos que el resultado final sea http://localhost:3000/api/login o http://localhost:8080/api/login

        let finalEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        // Ahora finalEndpoint no tiene barra inicial (ej. 'api/login', 'elecciones/1/circuitos/1')

        // Prependamos el /api/ solo si no está ya en el endpoint (útil para URLs del backend)
        if (!finalEndpoint.startsWith('api/')) { // Nota: comparo con 'api/' sin barra inicial
            finalEndpoint = `api/${finalEndpoint}`;
        }
        // Ahora finalEndpoint es 'api/login' o 'api/elecciones/1/circuitos/1'


        const requestUrl = `${API_BASE_URL}/${finalEndpoint}`;
        // Si API_BASE_URL es '', esto se convierte en '/api/login'
        // Si API_BASE_URL es 'http://localhost:8080', esto se convierte en 'http://localhost:8080/api/login

        try {
            const token = localStorage.getItem('userToken');
            const headers = {
                'Content-Type': 'application/json',
            };
            console.log("dwqdwq")
            if (requiresAuth && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const axiosConfig = {
                method: method.toLowerCase(),
                url: requestUrl, // Usa la URL final construida
                headers: headers,
                data: data,
            };

            const response = await axios(axiosConfig);

            return response.data.data;
            
        } catch (err) {
          toast.error(err.response.data.error)
           if (err.response) {
                setError(err.response.data);
                throw err;
            } else if (err.request) {
                setError({ message: "No se pudo conectar con el servidor. Verifique su conexión." });
                throw new Error("No se pudo conectar con el servidor.");
            } else {
                setError({ message: err.message });
                throw new Error(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, doRequest };
};

export default useApi;