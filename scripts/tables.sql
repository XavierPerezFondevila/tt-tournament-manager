CREATE TABLE ADMIN (
    NICK VARCHAR(50) PRIMARY KEY,
    PASSWORD VARCHAR(100) NOT NULL
);

INSERT INTO ADMIN (NICK, PASSWORD) VALUES
('xavi.perez', MD5('xavi.perez')),
('adrian.sanchez', MD5('adrian.sanchez')),
('eloi.zaragoza', MD5('eloi.zaragoza')),
('david.sala', MD5('david.sala'));


CREATE TABLE TORNEOS (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    NUM_GRUPOS INT NOT NULL,
    PLAZAS_TORNEO INT NOT NULL,
	NUM_CLASIFICADOS INT NOT NULL,
    UBICACION VARCHAR(200) NOT NULL
);

-- CREATE TABLE TORNEOS (
--     ID SERIAL PRIMARY KEY,
--     NOMBRE VARCHAR(100) NOT NULL,
--     FECHA_INICIO DATE NOT NULL,
--     NUM_GRUPOS INT NOT NULL,
--     PLAZAS_TORNEO INT NOT NULL,
-- 	NUM_CLASIFICADOS INT NOT NULL,
--     UBICACION VARCHAR(200) NOT NULL,
-- 	MODALIDAD VARCHAR(11) CHECK (MODALIDAD IN ('INDIVIDUAL', 'DOBLES'))
-- );

INSERT INTO TORNEOS (NOMBRE, FECHA_INICIO, NUM_GRUPOS, PLAZAS_TORNEO, UBICACION, MODALIDAD) 
VALUES ('Torneo Individual 1', '2024-05-15', 8, 64, 'Ciudad A', 'SOLO');

INSERT INTO TORNEOS (NOMBRE, FECHA_INICIO, NUM_GRUPOS, PLAZAS_TORNEO, UBICACION, MODALIDAD) 
VALUES ('Torneo Individual 2', '2024-06-20', 10, 80, 'Ciudad B', 'SOLO');

INSERT INTO TORNEOS (NOMBRE, FECHA_INICIO, NUM_GRUPOS, PLAZAS_TORNEO, UBICACION, MODALIDAD) 
VALUES ('Torneo Individual 3', '2024-07-10', 6, 48, 'Ciudad C', 'SOLO');

INSERT INTO TORNEOS (NOMBRE, FECHA_INICIO, NUM_GRUPOS, PLAZAS_TORNEO, UBICACION, MODALIDAD) 
VALUES ('Torneo Individual 4', '2024-08-05', 12, 96, 'Ciudad D', 'SOLO');

CREATE TABLE JUGADOR (
    ID SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(100) NOT NULL,
    ficha VARCHAR(100) NOT NULL UNIQUE,
	RANKING INT NOT NULL
);

INSERT INTO jugador (nombre, ficha, ranking) VALUES
('David Viñals', '1234567890', 457),
('Guillem Pich', '2345678901', 825),
('Frederic Mayeux', '3456789012', 312),
('Xavi Pérez', '4567890123', 1048),
('Francesc Conde', '5678901234', 687),
('David Garcia', '6789012345', 231),
('Ignasi Bueno', '7890123456', 1142),
('Josep Garrido', '8901234567', 549),
('Adrián García', '9012345678', 975),
('José Ortego', '0123456789', 389),
('Jesús Cubells', '9876543210', 116),
('Albert Solé', '8765432109', 704),
('Giulia Dipollina', '7654321098', 835),
('Carles Batet', '6543210987', 532),
('Abril Fornells', '5432109876', 1021),
('Vladimir Alert', '4321098765', 256),
('Leire López', '3210987654', 913),
('Manolo Suero', '2109876543', 641),
('Moisés Carulla', '1098765432', 743),
('Roger Puig', '0987654321', 398),
('Enrique Carrique', '0192837465', 1175),
('David Sala', '0918273645', 885),
('Adrian Sanchez', '1230984567', 202),
('Eloi Zaragoza', '3216549870', 589);


CREATE TABLE PARTICIPACION (
    ID SERIAL PRIMARY KEY,
    ID_TORNEO INT REFERENCES TORNEOS(ID),
    ID_JUGADOR INT REFERENCES JUGADOR(ID),
	GRUPO VARCHAR(2),
    CLASIFICADO BOOLEAN DEFAULT FALSE,
    ORDEN_CLASIFICADO INT
);


CREATE TABLE PARTIDOS (
    id SERIAL PRIMARY KEY,
    id_torneo INT,
    id_jugador1 INT,
    id_jugador2 INT,
    id_arbitro INT,
	ganador int,
    resultado TEXT,
	resultado_global VARCHAR(3),
    FOREIGN KEY (id_torneo) REFERENCES Torneos(id),
    FOREIGN KEY (id_jugador1) REFERENCES Jugador(id),
    FOREIGN KEY (id_jugador2) REFERENCES Jugador(id),
    FOREIGN KEY (id_arbitro) REFERENCES Jugador(id)
);




    -- newArray = [
    --     [68, 70, 86, 96, 90],
    --     [74, 71, 69, 75, 85, 89],
    --     [77, 92, 88, 79, 83],
    --     [78, 84, 72, 76, 93, 99],
    --     [91, 87, 80, 95, 98],
    --     [81, 82, 73, 94, 97],
    -- ];