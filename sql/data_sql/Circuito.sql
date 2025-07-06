INSERT INTO Circuito (numero, idEleccion, esAccesible, horaInicio, horaCierre, rangoInicioCred, rangoFinCred, serie, estado, idEstablecimiento) VALUES
-- Montevideo (serie AAA)
(1, 1, TRUE, '08:00:00', '19:30:00', '00000001', '00000100', 'AAA', 'por abrir', 1),
(2, 1, FALSE, '08:00:00', '19:30:00', '00000101', '00000200', 'AAA', 'por abrir', 1),
(3, 1, TRUE, '08:00:00', '19:30:00', '00000201', '00000300', 'AAA', 'por abrir', 1),

-- Canelones (serie BBB)
(4, 1, FALSE, '08:00:00', '19:30:00', '00000301', '00000400', 'BBB', 'por abrir', 3),
(5, 1, TRUE, '08:00:00', '19:30:00', '00000401', '00000500', 'BBB', 'por abrir', 3),
(6, 1, FALSE, '08:00:00', '19:30:00', '00000501', '00000600', 'BBB', 'por abrir', 3),

-- Durazno (serie CCC)
(7, 1, TRUE, '08:00:00', '19:30:00', '00000601', '00000700', 'CCC', 'por abrir', 6),
(8, 1, FALSE, '08:00:00', '19:30:00', '00000701', '00000800', 'CCC', 'por abrir', 6),
(9, 1, TRUE, '08:00:00', '19:30:00', '00000801', '00000900', 'CCC', 'por abrir', 6),

-- Maldonado (serie DDD)
(10, 1, TRUE, '08:00:00', '19:30:00', '00000901', '00001000', 'DDD', 'por abrir', 10),
(11, 1, FALSE, '08:00:00', '19:30:00', '00001001', '00001100', 'DDD', 'por abrir', 10),
(12, 1, TRUE, '08:00:00', '19:30:00', '00001101', '00001200', 'DDD', 'por abrir', 10),

-- Rivera (serie EEE)
(13, 1, TRUE, '08:00:00', '19:30:00', '00001201', '00001300', 'EEE', 'por abrir', 13),
(14, 1, FALSE, '08:00:00', '19:30:00', '00001301', '00001400', 'EEE', 'por abrir', 13),
(15, 1, TRUE, '08:00:00', '19:30:00', '00001401', '00001500', 'EEE', 'por abrir', 13);
