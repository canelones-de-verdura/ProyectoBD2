// src/shared/context/AuthContext.jsx (MODIFICADO)
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';
import { useElection } from './EleccionContext';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const { login: authLoginService, getCircuitDetailsByUrl } = AuthService();
    const { updateElectionInfo } = useElection();

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        // Limpiar toda la información del circuito al cerrar sesión
        updateElectionInfo({
            idEleccion: null, numeroCircuito: null, esAccesible: null, horaInicio: null,
            horaCierre: null, rangoInicioCred: null, rangoFinCred: null, serie: null,
            estado: null, establecimiento: null, mesa: null
        });
        toast.info('Sesión cerrada.');
    }, [updateElectionInfo]);
    
    useEffect(() => {
        const loadUserAndCircuitInfo = async () => {
            if (user && user.token && user.circuito?.url && !user.circuito.establecimiento) { // Si user.circuito aún no tiene todos los detalles (ej. establecimiento)
                try {
                    const circuitDetails = await getCircuitDetailsByUrl(user.circuito.url);

                    const fullUser = {
                        ...user,
                        circuito: circuitDetails
                    };
                    setUser(fullUser);
                    localStorage.setItem("user", JSON.stringify(fullUser)); // Actualizar localStorage también

                    // <-- PASO CLAVE: Guardar TODO el objeto circuitDetails
                    updateElectionInfo(circuitDetails);
                    toast.info('Información de usuario y circuito cargada desde el almacenamiento.');

                } catch (error) {
                    console.error("Error al cargar detalles del circuito desde localStorage:", error);
                    toast.error("Error al cargar detalles del circuito. Inicie sesión nuevamente.");
                    logout();
                }
            } else if (user && user.circuito && user.circuito.establecimiento) {
                // Si el usuario ya tiene los detalles completos del circuito (ej. ya se cargaron)
                // Asegurarse de que ElectionInfo también los tenga, por si se perdió la sincronización.
                updateElectionInfo(user.circuito);
            } else if (user && (!user.token || !user.circuito?.url)) {
                console.warn("Usuario en localStorage incompleto, se requiere re-autenticación.");
                logout();
            }
        };

        loadUserAndCircuitInfo();
    }, [user, updateElectionInfo, getCircuitDetailsByUrl, logout]);


    const login = useCallback(async (ci, credencial) => {
        try {
            const authResponse = await authLoginService(ci, credencial);
            const { token, circuito: basicCircuitInfo } = authResponse.data;

            const userBasicInfo = {
                ci: ci,
                credencial: credencial, // Considera si realmente quieres guardar esto
                token: token,
                circuito: basicCircuitInfo
            };
            // No guardar aún el usuario completo en localStorage, se hará después de la segunda llamada.
            setUser(userBasicInfo);


            const fullCircuitDetails = await getCircuitDetailsByUrl(basicCircuitInfo.url);

            const fullUser = {
                ...userBasicInfo,
                circuito: fullCircuitDetails // Reemplaza el circuito básico con el completo
            };
            localStorage.setItem("user", JSON.stringify(fullUser)); // Actualizar localStorage con user completo
            setUser(fullUser); // Actualizar el estado con el usuario completo

            toast.success('Inicio de sesión exitoso!');

            // <-- PASO CLAVE: Guardar TODO el objeto fullCircuitDetails
            if (fullCircuitDetails) { // Ya sabemos que existe si la llamada fue exitosa
                updateElectionInfo(fullCircuitDetails);
                toast.info(`Información de Elección (ID: ${fullCircuitDetails.idEleccion}) y Circuito (Nro: ${fullCircuitDetails.numero}) cargada.`);
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

            toast.error(errorMessage);
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("userToken");
            // Al fallar el login, también es buena idea limpiar la información de la elección
            updateElectionInfo({
                idEleccion: null, numeroCircuito: null, esAccesible: null, horaInicio: null,
                horaCierre: null, rangoInicioCred: null, rangoFinCred: null, serie: null,
                estado: null, establecimiento: null, mesa: null // Limpiar todos los campos del circuito
            });
            throw error;
        }
    }, [authLoginService, getCircuitDetailsByUrl, updateElectionInfo]);


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};