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
    UBICACION VARCHAR(200) NOT NULL,
	MODALIDAD VARCHAR(11) CHECK (MODALIDAD IN ('INDIVIDUAL', 'DOBLES'))
);

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
	EMAIL VARCHAR(100) NOT NULL UNIQUE,
    MOVIL VARCHAR(11) NOT NULL,
	RANKING INT NOT NULL
);

INSERT INTO jugador (nombre, email, movil, ranking) VALUES
('Jugador 1', 'jugador1@example.com', '1234567890', 457),
('Jugador 2', 'jugador2@example.com', '2345678901', 825),
('Jugador 3', 'jugador3@example.com', '3456789012', 312),
('Jugador 4', 'jugador4@example.com', '4567890123', 1048),
('Jugador 5', 'jugador5@example.com', '5678901234', 687),
('Jugador 6', 'jugador6@example.com', '6789012345', 231),
('Jugador 7', 'jugador7@example.com', '7890123456', 1142),
('Jugador 8', 'jugador8@example.com', '8901234567', 549),
('Jugador 9', 'jugador9@example.com', '9012345678', 975),
('Jugador 10', 'jugador10@example.com', '0123456789', 389),
('Jugador 11', 'jugador11@example.com', '9876543210', 116),
('Jugador 12', 'jugador12@example.com', '8765432109', 704),
('Jugador 13', 'jugador13@example.com', '7654321098', 835),
('Jugador 14', 'jugador14@example.com', '6543210987', 532),
('Jugador 15', 'jugador15@example.com', '5432109876', 1021),
('Jugador 16', 'jugador16@example.com', '4321098765', 256),
('Jugador 17', 'jugador17@example.com', '3210987654', 913),
('Jugador 18', 'jugador18@example.com', '2109876543', 641),
('Jugador 19', 'jugador19@example.com', '1098765432', 743),
('Jugador 20', 'jugador20@example.com', '0987654321', 398),
('Jugador 21', 'jugador21@example.com', '9876543210', 1175),
('Jugador 22', 'jugador22@example.com', '8765432109', 885),
('Jugador 23', 'jugador23@example.com', '7654321098', 202),
('Jugador 24', 'jugador24@example.com', '6543210987', 589);



CREATE TABLE PARTICIPACION (
    ID SERIAL PRIMARY KEY,
    ID_TORNEO INT REFERENCES TORNEOS(ID),
    ID_JUGADOR INT REFERENCES JUGADOR(ID),
	GRUPO VARCHAR(2)
);


CREATE TABLE PARTIDOS (
    id SERIAL PRIMARY KEY,
    id_torneo INT,
    id_jugador1 INT,
    id_jugador2 INT,
    id_arbitro INT,
    resultado TEXT,
    FOREIGN KEY (id_torneo) REFERENCES Torneos(id),
    FOREIGN KEY (id_jugador1) REFERENCES Jugador(id),
    FOREIGN KEY (id_jugador2) REFERENCES Jugador(id),
    FOREIGN KEY (id_arbitro) REFERENCES Jugador(id)
);

