// src/shared/context/ElectionContext.jsx
import React, { createContext, useState, useCallback, useContext, useEffect } from 'react'; // Importa useEffect

export const ElectionContext = createContext(null);

export const ElectionProvider = ({ children }) => {
    // Función de inicialización para cargar desde localStorage
    const getInitialElectionInfo = () => {
        // Define la estructura base por defecto
        const defaultInfo = {
            idEleccion: null,
            numeroCircuito: null, // Queremos que este sea el nombre consistente
            esAccesible: null,
            horaInicio: null,
            horaCierre: null,
            rangoInicioCred: null,
            rangoFinCred: null,
            serie: null,
            estado: null,
            establecimiento: null,
            mesa: null,
        };

        try {
            const storedData = localStorage.getItem("circuitData");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Si la data guardada tiene 'numero' en lugar de 'numeroCircuito', lo mapeamos al cargar
                if (parsedData.numero && !parsedData.numeroCircuito) {
                    parsedData.numeroCircuito = parsedData.numero;
                }
                // Fusiona la data parseada con los valores por defecto para asegurar todas las propiedades
                return { ...defaultInfo, ...parsedData };
            }
        } catch (error) {
            console.error("Error al parsear circuitData desde localStorage:", error);
            // Si hay un error al parsear, limpia el localStorage para evitar futuros errores
            localStorage.removeItem("circuitData");
        }
        return defaultInfo; // Retorna la info por defecto si no hay data guardada o si hubo error
    };

    // Inicializa el estado llamando a la función que carga desde localStorage
    const [electionInfo, setElectionInfo] = useState(getInitialElectionInfo);

    const updateElectionInfo = useCallback((newInfo) => {
        setElectionInfo(prevInfo => {
            if (!newInfo) return prevInfo;

            // Mapear 'numero' a 'numeroCircuito' al actualizar el estado si viene de una fuente externa
            const processedInfo = { ...newInfo };
            if (processedInfo.numero && !processedInfo.numeroCircuito) {
                processedInfo.numeroCircuito = processedInfo.numero;
            }

            const updatedInfo = {
                ...prevInfo,
                ...processedInfo,
            };

            // **Guardar en localStorage cada vez que electionInfo se actualice**
            // Importante: Asegurarse de que no haya ciclos infinitos de renderizado
            // Esto es más seguro hacerlo con un useEffect, como se muestra a continuación
            // localStorage.setItem("circuitData", JSON.stringify(updatedInfo));
            
            return updatedInfo;
        });
    }, []);

    // Utiliza useEffect para guardar en localStorage cuando electionInfo cambie
    useEffect(() => {
        try {
            // Guardar solo si electionInfo.idEleccion tiene un valor significativo
            // para evitar guardar el estado inicial de 'null' si no hay circuito habilitado
            if (electionInfo.idEleccion !== null) {
                localStorage.setItem("circuitData", JSON.stringify(electionInfo));
            } else {
                // Si por alguna razón idEleccion vuelve a ser null (ej. cerrar sesión),
                // puedes querer limpiar el localStorage.
                localStorage.removeItem("circuitData");
            }
        } catch (error) {
            console.error("Error al guardar circuitData en localStorage:", error);
        }
    }, [electionInfo]); // Se ejecuta cada vez que electionInfo cambia

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