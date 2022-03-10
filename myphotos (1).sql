-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 10, 2022 at 11:22 AM
-- Server version: 5.7.34
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myphotos`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `title`, `user_id`) VALUES
(1, 'Confettiiii album', 1),
(9, 'My album', 1),
(10, 'Christmas Album', 1),
(11, 'Jul', 9),
(12, 'Family Album', 1),
(13, 'Summmmmmmer!', 9);

-- --------------------------------------------------------

--
-- Table structure for table `albums_photos`
--

CREATE TABLE `albums_photos` (
  `photo_id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `albums_photos`
--

INSERT INTO `albums_photos` (`photo_id`, `album_id`) VALUES
(2, 9),
(1, 1),
(3, 1),
(6, 10),
(7, 12),
(4, 11),
(5, 11),
(6, 13),
(8, 13);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `title`, `url`, `comment`, `user_id`) VALUES
(1, 'Confetti Photo #1', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 'Confetti 4 live', 1),
(2, 'Confetti Photo #2', 'https://images.unsplash.com/photo-1481162854517-d9e353af153d', 'Confetti #2', 1),
(3, 'Confetti Photo #3', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Confetti #3', 1),
(4, 'Christmas Photo #1', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Christmas Photo #3', 9),
(5, 'Christmas photo #5', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 'God Jul', 9),
(6, 'Jul Foto #1', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Jul #1', 1),
(7, 'Family #1', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Family #1', 1),
(8, 'Summer Photo #1', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 'Sommar', 9);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`) VALUES
(1, 'marialovgren86@hotmail.com', '$2b$10$5fezq/z3TSB.NLe87KNmSuHTv1tDcdn0xCcjglmEeUMvExuzvQMg6', 'Maria', 'Lövgren'),
(9, 'anna@mail.com', '$2b$10$iRnSziC1iYg.Hz2aH9IgUO3mA92ZFZsWfO0GzPwaWmcWoK84Sqy2e', 'Anna', 'Svensson');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
