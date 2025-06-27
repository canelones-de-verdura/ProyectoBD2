-- Tabla Votante
CREATE TABLE Votante
(
    ci              BIGINT PRIMARY KEY,
    nombreCompleto  VARCHAR(255) NOT NULL,
    credencial      VARCHAR(50),
    fechaNacimiento DATE
);

-- Tabla Elección
CREATE TABLE Eleccion
(
    id    INT AUTO_INCREMENT PRIMARY KEY,
    tipo  VARCHAR(100),
    fecha DATE
);

-- Tabla Partido
CREATE TABLE Partido
(
    nombre         VARCHAR(255) PRIMARY KEY,
    presidente     VARCHAR(255),
    vicepresidente VARCHAR(255),
    numero         INT,
    calle          VARCHAR(255)
);

-- Tabla Candidato
CREATE TABLE Candidato
(
    ciVotante     BIGINT PRIMARY KEY,
    nombrePartido VARCHAR(255) NOT NULL,
    candidatura   VARCHAR(255) NOT NULL,
    FOREIGN KEY (nombrePartido) REFERENCES Partido (nombre),
    FOREIGN KEY (ciVotante) REFERENCES Votante (ci)
);

-- Tabla Departamento
CREATE TABLE Departamento
(
    numero INT PRIMARY KEY,
    nombre VARCHAR(100)
);

-- Tabla Comisaría
CREATE TABLE Comisaria
(
    numero             INT,
    numeroDepartamento INT,
    PRIMARY KEY (numero, numeroDepartamento),
    FOREIGN KEY (numeroDepartamento) REFERENCES Departamento (numero)
);

-- Tabla Establecimiento
CREATE TABLE Establecimiento
(
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    nombre             VARCHAR(255),
    tipo               VARCHAR(100),
    numeroDepartamento INT NOT NULL,
    FOREIGN KEY (numeroDepartamento) REFERENCES Departamento (numero)
);

-- Tabla Policía
CREATE TABLE Policia
(
    ciVotante          BIGINT,
    numeroFuncionario  INT,
    numeroComisaria    INT,
    numeroDepartamento INT,
    idEstablecimiento  INT NOT NULL,
    FOREIGN KEY (ciVotante) REFERENCES Votante (ci),
    FOREIGN KEY (idEstablecimiento) REFERENCES Establecimiento (id),
    FOREIGN KEY (numeroComisaria, numeroDepartamento) REFERENCES Comisaria (numero, numeroDepartamento),
    PRIMARY KEY (ciVotante)
);

-- Tabla Dirección
CREATE TABLE Direccion
(
    id     INT AUTO_INCREMENT PRIMARY KEY,
    calle  VARCHAR(255),
    numero VARCHAR(20),
    ciudad VARCHAR(100),
    pueblo VARCHAR(100),
    paraje VARCHAR(100)
);

-- Tabla DirecciónEstablecimiento
CREATE TABLE DireccionEstablecimiento
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    idEstablecimiento INT,
    idDireccion       INT,
    FOREIGN KEY (idEstablecimiento) REFERENCES Establecimiento (id),
    FOREIGN KEY (idDireccion) REFERENCES Direccion (id)
);

-- Tabla MiembroDeMesa
CREATE TABLE MiembroDeMesa
(
    ciVotante BIGINT,
    organismo VARCHAR(100),
    rol       VARCHAR(100),
    FOREIGN KEY (ciVotante) REFERENCES Votante (ci),
    PRIMARY KEY (ciVotante, rol)
);


-- Tabla Circuito
CREATE TABLE Circuito
(
    numero            INT,
    idEleccion        INT,
    esAccesible       BOOLEAN,
    horaInicio        TIME,
    horaCierre        TIME,
    rangoInicioCred   VARCHAR(50),
    rangoFinCred      VARCHAR(50),
    serie             VARCHAR(50),
    estado            VARCHAR(50),
    idEstablecimiento INT NOT NULL,
    FOREIGN KEY (idEstablecimiento) REFERENCES Establecimiento (id),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion (id),
    PRIMARY KEY (numero, idEleccion)
);

-- Tabla Mesa
CREATE TABLE Mesa
(
    numero         INT AUTO_INCREMENT,
    numeroCircuito INT    NOT NULL,
    idEleccion     INT    NOT NULL,
    ciPresidente   BIGINT NOT NULL,
    ciSecretario   BIGINT NOT NULL,
    ciVocal        BIGINT NOT NULL,
    PRIMARY KEY (numero, numeroCircuito, idEleccion),
    FOREIGN KEY (numeroCircuito, idEleccion) REFERENCES Circuito (numero, idEleccion),
    FOREIGN KEY (ciPresidente) REFERENCES Votante (ci),
    FOREIGN KEY (ciSecretario) REFERENCES Votante (ci),
    FOREIGN KEY (ciVocal) REFERENCES Votante (ci)
);

-- Tabla voto
CREATE TABLE Voto
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    tipo           VARCHAR(100),
    horaEmitido    TIME,
    numeroCircuito INT,
    idEleccion     INT,
    FOREIGN KEY (numeroCircuito, idEleccion) REFERENCES Circuito (numero, idEleccion)
);

CREATE TABLE Valido
(
    idVoto        INT PRIMARY KEY,
    nombrePartido VARCHAR(255),
    FOREIGN KEY (idVoto) REFERENCES Voto (id),
    FOREIGN KEY (nombrePartido) REFERENCES Partido (nombre)
);

-- Tabla vota
CREATE TABLE VotanteVota
(
    ciVotante   BIGINT NOT NULL,
    idEleccion  INT    NOT NULL,
    observado   BOOLEAN,
    numCircuito INT,
    PRIMARY KEY (ciVotante, idEleccion),
    FOREIGN KEY (ciVotante) REFERENCES Votante (ci),
    FOREIGN KEY (numCircuito, idEleccion) REFERENCES Circuito (numero, idEleccion)
);

CREATE TABLE CandidatoParticipa
(
    idEleccion  INT    NOT NULL,
    ciCandidato BIGINT NOT NULL,
    PRIMARY KEY (idEleccion, ciCandidato),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion (id),
    FOREIGN KEY (ciCandidato) REFERENCES Candidato (ciVotante)
);
