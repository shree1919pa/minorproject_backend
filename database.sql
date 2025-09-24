-- Create Database
CREATE DATABASE IF NOT EXISTS museumDB;
USE museumDB;

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','staff') DEFAULT 'staff'
);

-- Categories table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Artifacts table
CREATE TABLE Artifacts (
    artifact_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    origin VARCHAR(150),
    year_estimated VARCHAR(50),
    category_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Languages table
CREATE TABLE Languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    language_name VARCHAR(50) NOT NULL
);

-- Artifact Translations table
CREATE TABLE Artifact_Translations (
    translation_id INT AUTO_INCREMENT PRIMARY KEY,
    artifact_id INT,
    language_id INT,
    translated_name VARCHAR(200),
    translated_description TEXT,
    FOREIGN KEY (artifact_id) REFERENCES Artifacts(artifact_id),
    FOREIGN KEY (language_id) REFERENCES Languages(language_id)
);

-- Sample Data
INSERT INTO Categories (category_name) VALUES ('Sculpture'), ('Painting'), ('Coin'), ('Manuscript');
INSERT INTO Languages (language_name) VALUES ('English'), ('Hindi'), ('French'), ('German');
