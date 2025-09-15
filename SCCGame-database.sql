CREATE DATABASE IF NOT EXISTS sccgame;
USE sccgame;

DROP TABLE IF EXISTS languages;
CREATE TABLE languages (
    code VARCHAR(5) PRIMARY KEY,  
    name VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE     
);

INSERT INTO languages (`code`,`name`,`is_active`) Values 
('vi','Tiếng Việt',TRUE),
('zh','中文',TRUE),
('en','English',TRUE);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username varchar(20) UNIQUE,
    avatar varchar(100),
    password varchar(255),
    email varchar(255),
    xp BIGINT UNSIGNED
)


