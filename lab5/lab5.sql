-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 06 2026 г., 17:55
-- Версия сервера: 8.4.7
-- Версия PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `lab5`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tov`
--

DROP TABLE IF EXISTS `tov`;
CREATE TABLE IF NOT EXISTS `tov` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tov`
--

INSERT INTO `tov` (`id`, `name`, `price`, `category`, `amount`) VALUES
(1, 'Процесор Intel Core i5 12600K', 450.00, 'Комп\'ютерні комплектуючі', 120),
(2, 'Відеокарта Nvidia GeForce RTX 4060 8GB', 560.00, 'Комп\'ютерні комплектуючі', 130),
(3, 'Процесор Ryzen 5 9600X ', 250.00, 'Комп\'ютерні комплектуючі', 240),
(4, 'Відеокарта RX 9070 XT ', 670.00, 'Комп\'ютерні комплектуючі', 340),
(5, 'Материнська плата MSI B850M', 160.00, 'Комп\'ютерні комплектуючі', 456),
(6, 'Кулер для процесора Deepcool AK400 ZERO DARK 1700 AM5', 45.00, 'Комп\'ютерні комплектуючі', 652),
(7, 'Корпус для ПК Deepcool CG530 4F Black', 110.00, 'Комп\'ютерні комплектуючі', 623),
(8, 'Материнська плата Asus PRIME B760M-A D4-CSM для процесорів Intel', 140.00, 'Комп\'ютерні комплектуючі', 743),
(9, 'SSD диск Kingston SSDNow A400 240GB 2.5\" SATAIII 3D TLC (SA400S37/240G)', 78.00, 'Комп\'ютерні комплектуючі', 687);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `gender` enum('чоловіча','жіноча') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
