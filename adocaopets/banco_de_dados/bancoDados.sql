create database adotePet;

use adotePet;

-- Tabela de tipos de animais
CREATE TABLE Tipo_Animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    especie VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de endereços
CREATE TABLE Endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    complemento VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de usuários (login)
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('tutor', 'ong', 'admin') NOT NULL,
    foto_url VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de ONGs
CREATE TABLE ONG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    instagram VARCHAR(100),
    responsavel_nome VARCHAR(100),
    id_usuario INT UNIQUE,
    id_endereco INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_endereco) REFERENCES Endereco(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de tutores (pessoas físicas)
CREATE TABLE Tutor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    id_usuario INT UNIQUE,
    id_endereco INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_endereco) REFERENCES Endereco(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de animais
CREATE TABLE Animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    idade VARCHAR(100),
    porte ENUM('pequeno', 'medio', 'grande'),
    sexo ENUM('Macho', 'Femea'),
    descricao TEXT,
    foto_url VARCHAR(255),
    status ENUM('disponível', 'adotado', 'em tratamento', 'perdido') DEFAULT 'disponível',
    id_tipo_animal INT NOT NULL,
    id_ong INT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_animal) REFERENCES Tipo_Animal(id),
    FOREIGN KEY (id_ong) REFERENCES ONG(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de histórico médico dos animais
CREATE TABLE Historico_Medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_animal INT NOT NULL,
    descricao TEXT NOT NULL,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_animal) REFERENCES Animal(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de vacinas aplicadas
CREATE TABLE Vacina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_animal INT NOT NULL,
    nome_vacina VARCHAR(100) NOT NULL,
    data_aplicacao DATE NOT NULL,
    FOREIGN KEY (id_animal) REFERENCES Animal(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de adoções
CREATE TABLE Adocao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('aguardando contato', 'em andamento', 'concluido') NOT NULL DEFAULT 'aguardando contato',
    id_pessoa INT NOT NULL,
    id_animal INT NOT NULL,
    data_peticao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_conclusao DATE,
    observacoes TEXT,
    FOREIGN KEY (id_pessoa) REFERENCES Tutor(id),
    FOREIGN KEY (id_animal) REFERENCES Animal(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
