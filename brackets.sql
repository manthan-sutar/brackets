-- Adminer 4.8.1 MySQL 8.0.27 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `brackets` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `brackets`;

DROP TABLE IF EXISTS `competitors`;
CREATE TABLE `competitors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `competitors` (`id`, `tournament_id`, `name`, `created_at`, `updated_at`) VALUES
(329,	40,	'Carine',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(330,	40,	'Cherin',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(331,	40,	'Benni',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(332,	40,	'Dorice',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(333,	40,	'Darcey',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(334,	40,	'Shaun',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(335,	40,	'Brandie',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(336,	40,	'Ricca',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(337,	40,	'Maurita',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(338,	40,	'Ingeberg',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(339,	40,	'Winonah',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(340,	40,	'Sunshine',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(341,	40,	'Ulrikaumeko',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(342,	40,	'Cherianne',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(343,	40,	'Valeria',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26'),
(344,	40,	'Martynne',	'2021-12-12 15:10:26',	'2021-12-12 15:10:26');

DROP TABLE IF EXISTS `match_competitors`;
CREATE TABLE `match_competitors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `competitor_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `last_users_position` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `match_competitors` (`id`, `match_id`, `competitor_id`, `score`, `last_users_position`, `created_at`, `updated_at`) VALUES
(66,	107,	341,	87,	NULL,	'2021-12-12 17:40:10',	'2021-12-12 17:40:10'),
(67,	109,	329,	3,	NULL,	'2021-12-12 17:40:52',	'2021-12-12 17:40:52'),
(68,	108,	336,	90,	NULL,	'2021-12-12 17:40:27',	'2021-12-12 17:40:27'),
(69,	112,	330,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(70,	114,	332,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(71,	110,	333,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(72,	111,	331,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(73,	113,	334,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(74,	107,	344,	20,	NULL,	'2021-12-12 17:37:38',	'2021-12-12 17:37:38'),
(75,	109,	337,	100,	NULL,	'2021-12-12 17:40:46',	'2021-12-12 17:40:46'),
(76,	108,	342,	10,	NULL,	'2021-12-12 17:40:18',	'2021-12-12 17:40:18'),
(77,	110,	335,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(78,	111,	338,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(79,	114,	340,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(80,	112,	339,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36'),
(81,	113,	343,	NULL,	NULL,	'2021-12-12 15:12:36',	'2021-12-12 15:12:36');

DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `last_match_id` int DEFAULT NULL,
  `side` varchar(10) NOT NULL,
  `round` int NOT NULL,
  `sort` int DEFAULT NULL,
  `winner_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `matches` (`id`, `tournament_id`, `last_match_id`, `side`, `round`, `sort`, `winner_id`, `created_at`, `updated_at`) VALUES
(107,	40,	NULL,	'left',	1,	1,	341,	'2021-12-12 15:12:35',	'2021-12-12 17:40:10'),
(108,	40,	NULL,	'left',	1,	2,	336,	'2021-12-12 15:12:35',	'2021-12-12 17:40:27'),
(109,	40,	NULL,	'left',	1,	3,	337,	'2021-12-12 15:12:35',	'2021-12-12 17:40:52'),
(110,	40,	NULL,	'left',	1,	4,	NULL,	'2021-12-12 15:12:35',	'2021-12-12 15:12:35'),
(111,	40,	NULL,	'right',	1,	5,	NULL,	'2021-12-12 15:12:35',	'2021-12-12 15:12:35'),
(112,	40,	NULL,	'right',	1,	6,	NULL,	'2021-12-12 15:12:35',	'2021-12-12 15:12:35'),
(113,	40,	NULL,	'right',	1,	7,	NULL,	'2021-12-12 15:12:35',	'2021-12-12 15:12:35'),
(114,	40,	NULL,	'right',	1,	8,	NULL,	'2021-12-12 15:12:35',	'2021-12-12 15:12:35');

DROP TABLE IF EXISTS `tournaments`;
CREATE TABLE `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `number_of_competators` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `tournaments` (`id`, `name`, `number_of_competators`, `is_active`, `created_at`, `updated_at`) VALUES
(40,	'Brackets',	16,	1,	'2021-12-12 15:10:26',	'2021-12-12 15:12:37');

-- 2021-12-12 17:42:55
