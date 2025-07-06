// src/shared/context/ElectionContext.jsx (MODIFICADO - Ajuste la inicialización)
import React, { createContext, useState, useCallback, useContext} from 'react';

export const ElectionContext = createContext(null);

export const ElectionProvider = ({ children }) => {
    // Inicialización del estado para guardar toda la información del circuito
    const [electionInfo, setElectionInfo] = useState(() => {
        // Podrías intentar cargarla desde localStorage si la guardaste allí
        // aunque es más común que AuthContext la establezca al inicio
        // para asegurar que esté sincronizada con el usuario autenticado.
        return {
            idEleccion: null,
            numeroCircuito: null,
            esAccesible: null,
            horaInicio: null,
            horaCierre: null,
            rangoInicioCred: null,
            rangoFinCred: null,
            serie: null,
            estado: null,
            establecimiento: null,
            mesa: null,
            // Agrega cualquier otro campo que venga en fullCircuitDetails
        };
    });

    const updateElectionInfo = useCallback((newInfo) => {
        setElectionInfo(prevInfo => {
            // Asegúrate de que 'newInfo' no sea nulo o indefinido
            if (!newInfo) return prevInfo;
            return {
                ...prevInfo,
                ...newInfo,
            };
        });
    }, []);

    return (
        <ElectionContext.Provider value={{ electionInfo, updateElectionInfo }}>
            {children}
        </ElectionContext.Provider>
    );
};

// 3. Crear un hook personalizado para consumir el contexto fácilmente
export const useElection = () => {
    const context = useContext(ElectionContext);
    if (!context) {
        throw new Error('useElection must be used within an ElectionProvider');
    }
    return context;
};