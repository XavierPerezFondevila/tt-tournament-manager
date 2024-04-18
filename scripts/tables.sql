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
    ID SERIAL,
	NOMBRE VARCHAR(100) NOT NULL,
	EMAIL VARCHAR(100) PRIMARY_KEY,
    MOVIL VARCHAR(11) NOT NULL,
	RANKING INT,
	
);