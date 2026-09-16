DROP DATABASE IF EXISTS portfolio;

CREATE DATABASE portfolio;

USE portfolio;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('aluna', 'professores') NOT NULL
);


INSERT INTO usuarios (usuario, senha, tipo)
VALUES ('duda@senai.com', '123456', 'aluna');


INSERT INTO usuarios (usuario, senha, tipo)
VALUES ('prof@gmail.com', '123456', 'professores');

SELECT * FROM usuarios;
