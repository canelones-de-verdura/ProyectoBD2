// src/shared/context/AuthContext.jsx
import React, { createContext, useState, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService'; // Asegúrate que la ruta sea correcta
import { useElection } from './EleccionContext'; // Suponiendo que tienes este contexto

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Intentar cargar el usuario de localStorage al inicio de la aplicación
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const { updateElectionInfo } = useElection();
    const { login: authLoginService, getCircuitDetailsByUrl } = AuthService();

    const login = useCallback(async (ci, credencial) => {
        try {
            const { token, circuito: basicCircuitInfo } = await authLoginService(ci, credencial);

            const userBasicInfo = {
                ci: ci,
                credencial: credencial,
                token: token, // El token está aquí
                circuito: basicCircuitInfo
            };
            // --- ¡CAMBIO CLAVE AQUÍ: GUARDA EL TOKEN SEPARADAMENTE! ---
            localStorage.setItem("userToken", token);

            const fullCircuitDetails = await getCircuitDetailsByUrl(basicCircuitInfo.url);

            const fullUser = {
                ...userBasicInfo,
                circuito: fullCircuitDetails
            };

            console.log("Basic", basicCircuitInfo)
            localStorage.setItem("circuitData", JSON.stringify(fullCircuitDetails));
            localStorage.setItem("user", JSON.stringify(fullUser));
            setUser(fullUser);

            console.log("genial", fullCircuitDetails)

            // Asumiendo que esta es la parte de tu código donde recibes fullCircuitDetails
            // Probablemente en AuthService o un componente que inicializa el contexto
            console.log("genial", fullCircuitDetails);

            if (fullCircuitDetails) {
                // Crea un nuevo objeto para mapear 'numero' a 'numeroCircuito'
                const mappedCircuitDetails = {
                    ...fullCircuitDetails, // Copia todas las propiedades existentes
                    numeroCircuito: fullCircuitDetails.numero // Mapea 'numero' a 'numeroCircuito'
                    // Si 'numero' debe desaparecer, puedes usar:
                    // numero: undefined // Esto lo eliminará del objeto final, si es deseado
                };

                updateElectionInfo(mappedCircuitDetails); // Pasa el objeto mapeado
            } else {
                toast.warn('No se pudo obtener la información completa de la elección/circuito desde el servidor.');
            }

        } catch (error) {
            let errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión o si el servidor está activo.';
                console.error("Error de red o servidor no disponible:", error);
            } else {
                errorMessage = 'Ocurrió un error inesperado al procesar la solicitud.';
                console.error("Error inesperado en la solicitud:", error);
            }

            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("userToken"); // <-- ¡Asegúrate de limpiar también el token!
            updateElectionInfo({
                idEleccion: null, numeroCircuito: null, esAccesible: null, horaInicio: null,
                horaCierre: null, rangoInicioCred: null, rangoFinCred: null, serie: null,
                estado: null, establecimiento: null, mesa: null
            });
            throw error;
        }
    }, [authLoginService, getCircuitDetailsByUrl, updateElectionInfo]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userToken"); // <-- ¡Asegúrate de limpiar también el token al cerrar sesión!
        updateElectionInfo({
            idEleccion: null, numeroCircuito: null, esAccesible: null, horaInicio: null,
            horaCierre: null, rangoInicioCred: null, rangoFinCred: null, serie: null,
            estado: null, establecimiento: null, mesa: null
        });
        toast.info('Sesión cerrada.');
    }, [updateElectionInfo]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};