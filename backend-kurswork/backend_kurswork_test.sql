-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 05 2026 г., 20:42
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
-- База данных: `backend_kurswork_test`
--

-- --------------------------------------------------------

--
-- Структура таблицы `answers`
--

DROP TABLE IF EXISTS `answers`;
CREATE TABLE IF NOT EXISTS `answers` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID відповіді',
  `question_id` int NOT NULL COMMENT 'Зовнішній ключ зв''язку з таблицею questions',
  `answer_text` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Текст варіанту відповіді',
  `is_correct` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Перевірка, чи обрана відповідь є правильною',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблиця з варіантами відповідей';

-- --------------------------------------------------------

--
-- Структура таблицы `questions`
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID питання',
  `test_id` int NOT NULL COMMENT 'Зовнішній ключ зв''язку до таблиці tests',
  `question_text` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Поле для довгих питань тесту',
  `points` int NOT NULL COMMENT 'Кількість набраних балів за обрані відповіді',
  PRIMARY KEY (`id`),
  KEY `test_id` (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблиця з питаннями';

-- --------------------------------------------------------

--
-- Структура таблицы `results`
--

DROP TABLE IF EXISTS `results`;
CREATE TABLE IF NOT EXISTS `results` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID результату тестування',
  `user_id` int NOT NULL COMMENT 'ID користувача (Зв''язок з таблицею users)',
  `test_id` int NOT NULL COMMENT 'ID тесту (Зв''язок з таблицею tests)',
  `score` decimal(5,2) NOT NULL COMMENT 'Кількість набраних балів',
  `completed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата завершення тесту',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`,`test_id`),
  KEY `fk_results_tests` (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблиця з результатами тестування';

-- --------------------------------------------------------

--
-- Структура таблицы `tests`
--

DROP TABLE IF EXISTS `tests`;
CREATE TABLE IF NOT EXISTS `tests` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID тесту',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Заголовок тесту',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Опис тесту',
  `time_limit` int NOT NULL COMMENT 'Обмеження часу тесту у хвилинах',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата створення тесту',
  `is_fullscreen` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Режим проходження тесту у повний екран',
  `disable_copy` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Заборона операції копіювання',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблиця тестів';

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID користувача',
  `login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Унікальний логін для входу',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Захешований пароль',
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ПІБ користувача',
  `role` enum('admin','student') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Роль: admin - викладач; student - студент',
  `group_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Шифр групи',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата створення користувача',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблиця з користувачами';

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `full_name`, `role`, `group_name`, `created_at`) VALUES
(1, 'admin', '$2y$10$v5nGz2z5qrjEFUsNw60tO.6hNezmqOjNEucNDVQ2EaFII9QARcG8O', 'Черепанов Ілля Ігорович', 'admin', NULL, '2026-05-04 12:19:43');

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `fk_answers_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_tests` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `fk_results_tests` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_results_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
