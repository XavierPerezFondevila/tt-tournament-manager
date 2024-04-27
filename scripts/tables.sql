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

INSERT INTO JUGADOR (nombre, email, movil, ranking) VALUES
('Juan Pérez', 'juanperez@example.com', '123456789', 100),
('María García', 'mariagarcia@example.com', '987654321', 200),
('Pedro Martínez', 'pedromartinez@example.com', '111222333', 300),
('Ana López', 'analopez@example.com', '444555666', 400),
('Luis Rodríguez', 'luisrodriguez@example.com', '777888999', 500),
('Laura Sánchez', 'laurasanchez@example.com', '666555444', 600),
('Carlos Gómez', 'carlosgomez@example.com', '999888777', 700),
('Sofía Martín', 'sofiamartin@example.com', '222333444', 800),
('Miguel Fernández', 'miguelfernandez@example.com', '111444777', 900),
('Elena Pérez', 'elenaperez@example.com', '555444333', 1000),
('Daniel Ruiz', 'danielruiz@example.com', '333222111', 1100),
('Lucía Gutiérrez', 'luciagutierrez@example.com', '999111222', 1200),
('Pablo Serrano', 'pabloserrano@example.com', '888777666', 1300),
('Andrea Torres', 'andreatorres@example.com', '777666555', 1400),
('Javier Jiménez', 'javierjimenez@example.com', '222111000', 1500),
('Rosa López', 'rosalopez@example.com', '555666777', 110),
('Diego Pérez', 'diegoperez@example.com', '888999000', 220),
('Marina Rodríguez', 'marinarodriguez@example.com', '123456789', 330),
('Alberto Gómez', 'albertogomez@example.com', '987654321', 440),
('Carmen Sánchez', 'carmensanchez@example.com', '111222333', 550),
('Jorge Martínez', 'jorgemartinez@example.com', '444555666', 660);


CREATE TABLE PARTICIPACION (
    ID SERIAL PRIMARY KEY,
    ID_TORNEO INT REFERENCES TORNEOS(ID),
    ID_JUGADOR INT REFERENCES JUGADOR(ID),
	GRUPO VARCHAR(2)
);