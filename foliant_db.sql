-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 21 2025 г., 19:19
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `foliant_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `authors`
--

CREATE TABLE `authors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `authors`
--

INSERT INTO `authors` (`id`, `name`) VALUES
(1, 'Джордж Оруэлл'),
(2, 'Михаил Булгаков'),
(3, 'Фрэнк Герберт'),
(4, 'Аркадий и Борис Стругацкие'),
(5, 'Айзек Азимов'),
(6, 'Рэй Брэдбери'),
(7, 'Фёдор Достоевский'),
(8, 'Дэниел Киз'),
(9, 'Роберт Хайнлайн'),
(10, 'Урсула Ле Гуин'),
(11, 'Филип Дик'),
(12, 'Станислав Лем'),
(13, 'Дэн Симмонс'),
(14, 'Уильям Гибсон'),
(15, 'Нил Стивенсон'),
(16, 'Джордж Мартин'),
(17, 'Анджей Сапковский'),
(18, 'Дж.Р.Р. Толкин'),
(19, 'Терри Пратчетт'),
(20, 'Роджер Желязны'),
(21, 'Лев Толстой'),
(22, 'Эрих Мария Ремарк'),
(23, 'Габриэль Гарсиа Маркес'),
(24, 'Харпер Ли'),
(25, 'Джером Сэлинджер');

-- --------------------------------------------------------

--
-- Структура таблицы `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `publisher_id` int(11) DEFAULT NULL,
  `publication_year` int(4) DEFAULT NULL,
  `pages` int(11) DEFAULT NULL,
  `cover_image_path` varchar(255) DEFAULT '/images/placeholder.jpg',
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `books`
--

INSERT INTO `books` (`id`, `title`, `isbn`, `description`, `publisher_id`, `publication_year`, `pages`, `cover_image_path`, `price`, `stock_quantity`) VALUES
(1, '1984', '978-5-17-080112-9', 'Культовый роман-антиутопия о тоталитарном обществе и Большом Брате.', 2, 2021, 320, '/images/covers/1984.jpg', 450.00, 50),
(2, 'Мастер и Маргарита', '978-5-389-01753-7', 'Величайший мистический роман XX века, полный сатиры, любви и философии.', 3, 2022, 480, '/images/covers/master_margarita.jpg', 620.00, 35),
(3, 'Дюна', '978-5-17-135898-3', 'Первая книга из легендарного цикла о планете Арракис, специи и гигантских червях.', 1, 2021, 704, '/images/covers/dune.jpg', 890.00, 25),
(4, 'Пикник на обочине', '978-5-17-098553-9', 'Повесть о сталкерах и таинственной Зоне, полной опасных аномалий и бесценных артефактов.', 2, 2020, 256, '/images/covers/picnic.jpg', 380.00, 40),
(5, 'Основание', '978-5-04-118831-2', 'Первый роман цикла о крушении Галактической Империи и плане психоисторика Гэри Селдона.', 1, 2023, 320, '/images/covers/foundation.jpg', 550.00, 30),
(6, '451 градус по Фаренгейту', '978-5-04-094951-4', 'Антиутопия о будущем, где все книги подлежат сожжению, а пожарные их сжигают.', 1, 2018, 256, '/images/covers/fahrenheit_451.jpg', 410.00, 60),
(7, 'Преступление и наказание', '978-5-389-06517-0', 'История о метаниях души студента Раскольникова и границах морали.', 3, 2019, 608, '/images/covers/prestuplenie_i_nakazanie.jpg', 580.00, 22),
(8, 'Цветы для Элджернона', '978-5-04-096846-1', 'Трогательная история об эксперименте по повышению интеллекта, разуме и человечности.', 1, 2019, 320, '/images/covers/flowers_for_algernon.jpg', 490.00, 45),
(9, 'Дверь в лето', '978-5-699-86132-7', 'Остроумная история инженера, который с помощью криосна и машины времени ищет справедливость.', 1, 2016, 288, '/images/covers/door_to_summer.jpg', 430.00, 33),
(10, 'Волшебник Земноморья', '978-5-389-07386-1', 'Начало великого цикла о магии, равновесии и становлении великого волшебника Геда.', 3, 2018, 288, '/images/covers/wizard_of_earthsea.jpg', 510.00, 28),
(11, 'Мечтают ли андроиды об электроовцах?', '978-5-699-82390-5', 'Нуарный киберпанк, послуживший основой для фильма \"Бегущий по лезвию\".', 1, 2017, 288, '/images/covers/do_androids_dream.jpg', 480.00, 18),
(12, 'Солярис', '978-5-17-096057-4', 'Философская фантастика о контакте с разумным Океаном, который материализует потаенные воспоминания.', 2, 2021, 320, '/images/covers/solaris.jpg', 460.00, 29),
(13, 'Гиперион', '978-5-17-105232-4', 'Космическая опера, построенная по принципу \"Кентерберийских рассказов\", где паломники рассказывают свои истории.', 2, 2019, 576, '/images/covers/hyperion.jpg', 790.00, 15),
(14, 'Нейромант', '978-5-389-08209-2', 'Роман, определивший каноны жанра \"киберпанк\". Матрица, хакеры, искусственный интеллект.', 3, 2020, 384, '/images/covers/neuromancer.jpg', 530.00, 21),
(15, 'Лавина', '978-5-17-120530-0', 'Посткиберпанк о Метавселенной, вирусах, лингвистике и шумерской мифологии.', 2, 2021, 544, '/images/covers/snow_crash.jpg', 680.00, 24),
(16, 'Игра престолов', '978-5-17-078518-4', 'Первая книга саги \"Песнь Льда и Пламени\". Интриги, войны и драконы в борьбе за Железный трон.', 2, 2019, 768, '/images/covers/game_of_thrones.jpg', 950.00, 40),
(17, 'Ведьмак. Последнее желание', '978-5-17-093198-9', 'Сборник рассказов о ведьмаке Геральте из Ривии.', 2, 2019, 320, '/images/covers/last_wish.jpg', 550.00, 60),
(18, 'Властелин колец. Братство кольца', '978-5-17-108502-5', 'Начало величайшего фэнтези-эпоса о походе хоббитов для уничтожения Кольца Всевластия.', 2, 2021, 512, '/images/covers/fellowship_of_the_ring.jpg', 850.00, 50),
(19, 'Цвет волшебства', '978-5-699-82662-3', 'Первая книга из цикла о Плоском мире, где магия реальна, а мир стоит на четырех слонах и черепахе.', 1, 2017, 352, '/images/covers/colour_of_magic.jpg', 480.00, 30),
(20, 'Хроники Амбера. Девять принцев Амбера', '978-5-699-87355-9', 'Начало саги о королевской семье, способной путешествовать между мирами-отражениями.', 1, 2018, 224, '/images/covers/nine_princes_in_amber.jpg', 420.00, 25),
(21, 'Война и мир', '978-5-389-03399-5', 'Монументальный роман-эпопея о русском обществе в эпоху войн против Наполеона.', 3, 2020, 1344, '/images/covers/war_and_peace.jpg', 1200.00, 18),
(22, 'На Западном фронте без перемен', '978-5-17-088126-8', 'Антивоенный роман о \"потерянном поколении\" молодых людей, прошедших ужасы Первой мировой войны.', 2, 2019, 224, '/images/covers/all_quiet.jpg', 350.00, 45),
(23, 'Сто лет одиночества', '978-5-17-080493-9', 'Магический реализм, рассказывающий историю семьи Буэндиа в мифическом городе Макондо.', 2, 2021, 480, '/images/covers/one_hundred_years.jpg', 610.00, 26),
(24, 'Убить пересмешника', '978-5-17-092323-4', 'История о взрослении, расовых предрассудках и чести на юге Америки.', 2, 2020, 416, '/images/covers/to_kill_a_mockingbird.jpg', 520.00, 38),
(25, 'Над пропастью во ржи', '978-5-699-84739-0', 'Культовый роман о бунтующем подростке Холдене Колфилде и его неприятии взрослого мира.', 1, 2019, 288, '/images/covers/catcher_in_the_rye.jpg', 450.00, 48),
(26, 'Атлант расправил плечи', '978-5-9614-7264-9', 'Роман-бестселлер о предпринимателях и силе индивидуализма.', 5, 2020, 1168, '/images/covers/placeholder.jpg', 1500.00, 20),
(27, 'Источник', '978-5-9614-7331-8', 'Философский роман о творце-архитекторе, отстаивающем свою свободу.', 5, 2019, 752, '/images/covers/placeholder.jpg', 950.00, 15),
(28, 'Sapiens: Краткая история человечества', '978-5-905891-64-5', 'Научно-популярная книга об истории человеческого вида от каменного века до наших дней.', 4, 2016, 512, '/images/covers/placeholder.jpg', 880.00, 55),
(29, 'Homo Deus: Краткая история будущего', '978-5-907033-28-2', 'Продолжение Sapiens, исследующее будущее человечества.', 4, 2018, 496, '/images/covers/placeholder.jpg', 890.00, 40),
(30, 'Думай медленно... решай быстро', '978-5-17-080053-5', 'Книга нобелевского лауреата о двух системах мышления, управляющих нашей жизнью.', 2, 2013, 656, '/images/covers/placeholder.jpg', 750.00, 60),
(31, '7 навыков высокоэффективных людей', '978-5-9614-6816-1', 'Одна из самых влиятельных книг по саморазвитию.', 5, 2018, 396, '/images/covers/placeholder.jpg', 680.00, 80),
(32, 'Богатый папа, бедный папа', '978-985-15-3232-1', 'Книга, изменившая представление о деньгах и инвестировании у миллионов людей.', 1, 2017, 352, '/images/covers/placeholder.jpg', 550.00, 70),
(33, 'Илон Маск: Tesla, SpaceX и дорога в будущее', '978-5-389-13352-7', 'Биография одного из самых ярких визионеров нашего времени.', 3, 2017, 416, '/images/covers/placeholder.jpg', 650.00, 30),
(34, 'Стив Джобс', '978-5-17-083118-8', 'Авторизованная биография основателя Apple от Уолтера Айзексона.', 2, 2015, 656, '/images/covers/placeholder.jpg', 990.00, 25),
(35, 'От хорошего к великому', '978-5-00100-394-4', 'Исследование о том, почему одни компании совершают прорыв, а другие нет.', 4, 2017, 352, '/images/covers/placeholder.jpg', 720.00, 40),
(36, 'Черный лебедь. Под знаком непредсказуемости', '978-5-389-09608-2', 'Книга о влиянии случайных и непредсказуемых событий на нашу жизнь.', 3, 2015, 528, '/images/covers/placeholder.jpg', 690.00, 35),
(37, 'Антихрупкость. Как извлечь выгоду из хаоса', '978-5-389-11020-7', 'Продолжение идей \"Черного лебедя\" о системах, которые становятся сильнее от стресса.', 3, 2016, 768, '/images/covers/placeholder.jpg', 850.00, 30),
(38, 'Психология влияния', '978-5-496-03305-6', 'Классическая книга о механизмах убеждения и мотивации.', 1, 2018, 480, '/images/covers/placeholder.jpg', 670.00, 50),
(39, 'Поток: Психология оптимального переживания', '978-5-91657-857-4', 'Исследование состояния \"потока\", когда человек полностью поглощен деятельностью.', 4, 2013, 464, '/images/covers/placeholder.jpg', 620.00, 28),
(40, 'Выйди из зоны комфорта. Измени свою жизнь', '978-5-00100-748-5', '21 метод повышения личной эффективности.', 4, 2017, 128, '/images/covers/placeholder.jpg', 350.00, 90),
(41, 'Гибкое сознание', '978-5-00100-753-9', 'Книга о двух типах мышления - установке на данность и установке на рост.', 4, 2017, 304, '/images/covers/placeholder.jpg', 580.00, 42),
(42, 'Эмоциональный интеллект', '978-5-00100-802-4', 'Книга, которая популяризировала концепцию EQ.', 4, 2017, 544, '/images/covers/placeholder.jpg', 780.00, 38),
(43, 'Игры, в которые играют люди', '978-5-699-95982-6', 'Классика транзактного анализа от Эрика Берна.', 1, 2018, 256, '/images/covers/placeholder.jpg', 450.00, 55),
(44, 'Человек, который принял жену за шляпу', '978-5-17-092305-0', 'Занимательные истории из практики известного нейропсихолога Оливера Сакса.', 2, 2015, 352, '/images/covers/placeholder.jpg', 530.00, 33),
(45, 'Искусство любить', '978-5-17-089201-1', 'Философское эссе Эриха Фромма о любви как об искусстве, требующем знаний и усилий.', 2, 2016, 224, '/images/covers/placeholder.jpg', 320.00, 65),
(46, 'Бойня номер пять, или Крестовый поход детей', '978-5-17-094336-9', 'Антивоенный роман Курта Воннегута с элементами научной фантастики.', 2, 2016, 224, '/images/covers/placeholder.jpg', 380.00, 41),
(47, 'Заводной апельсин', '978-5-17-094625-4', 'Скандальный роман Энтони Бёрджесса о природе насилия и свободе воли.', 2, 2016, 256, '/images/covers/placeholder.jpg', 390.00, 37),
(48, 'Посторонний', '978-5-17-093892-4', 'Манифест экзистенциализма от Альбера Камю.', 2, 2015, 160, '/images/covers/placeholder.jpg', 290.00, 52),
(49, 'Тошнота', '978-5-17-093893-1', 'Философский роман Жан-Поля Сартра, ключевое произведение экзистенциализма.', 2, 2015, 256, '/images/covers/placeholder.jpg', 340.00, 44),
(50, 'Процесс', '978-5-389-04771-8', 'Абсурдистский роман Франца Кафки о человеке, попавшем в жернова безличной бюрократической машины.', 3, 2016, 288, '/images/covers/placeholder.jpg', 410.00, 31);

-- --------------------------------------------------------

--
-- Структура таблицы `book_authors`
--

CREATE TABLE `book_authors` (
  `book_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `book_authors`
--

INSERT INTO `book_authors` (`book_id`, `author_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25);

-- --------------------------------------------------------

--
-- Структура таблицы `book_categories`
--

CREATE TABLE `book_categories` (
  `book_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `book_categories`
--

INSERT INTO `book_categories` (`book_id`, `category_id`) VALUES
(1, 1),
(1, 3),
(2, 4),
(2, 5),
(3, 1),
(3, 2),
(4, 1),
(5, 1),
(6, 1),
(6, 3),
(7, 4),
(8, 1),
(8, 5),
(9, 1),
(10, 2),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 4),
(22, 4),
(23, 5),
(24, 4),
(25, 5),
(26, 8),
(27, 5),
(28, 7),
(29, 7),
(30, 7),
(31, 8),
(32, 8),
(33, 8),
(34, 8),
(35, 8),
(36, 7),
(37, 7),
(38, 7),
(39, 7),
(40, 8),
(41, 7),
(42, 7),
(43, 7),
(44, 7),
(45, 4),
(46, 1),
(47, 3),
(48, 4),
(49, 5),
(50, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `override_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Научная фантастика'),
(2, 'Фэнтези'),
(3, 'Антиутопия'),
(4, 'Классическая проза'),
(5, 'Современная проза'),
(6, 'Детектив'),
(7, 'Психология'),
(8, 'Бизнес-литература');

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('order_status','special_offer','system') NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `link`, `is_read`, `created_at`) VALUES
(1, 2, 'order_status', 'Ваш заказ №1 был отправлен. Ожидайте доставку!', '/profile', 0, '2025-06-21 17:19:02'),
(2, 3, 'special_offer', 'Супер-Админ сделал вам персональное предложение на книгу \"Дюна\"!', '/notifications', 0, '2025-06-21 17:19:02');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `delivery_address` text NOT NULL,
  `status` enum('processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'processing',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `delivery_address`, `status`, `created_at`) VALUES
(1, 2, 1070.00, 'г. Санкт-Петербург, Невский пр-т, д. 28, кв. 5', 'shipped', '2025-06-21 17:19:02');

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_per_item` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `quantity`, `price_per_item`) VALUES
(1, 1, 1, 1, 450.00),
(2, 1, 4, 1, 380.00),
(3, 1, 24, 1, 240.00);

-- --------------------------------------------------------

--
-- Структура таблицы `publishers`
--

CREATE TABLE `publishers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `publishers`
--

INSERT INTO `publishers` (`id`, `name`) VALUES
(1, 'Эксмо'),
(2, 'АСТ'),
(3, 'Азбука-Аттикус'),
(4, 'МИФ (Манн, Иванов и Фербер)'),
(5, 'Альпина Паблишер');

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'client');

-- --------------------------------------------------------

--
-- Структура таблицы `special_offers`
--

CREATE TABLE `special_offers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `offer_price` decimal(10,2) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `special_offers`
--

INSERT INTO `special_offers` (`id`, `user_id`, `book_id`, `offer_price`, `expires_at`, `is_accepted`, `created_at`) VALUES
(1, 3, 3, 500.00, '2025-12-31 23:59:59', 0, '2025-06-21 17:19:02');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(60) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 2,
  `delivery_address` text DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role_id`, `delivery_address`, `is_blocked`, `created_at`) VALUES
(1, 'Супер Админ', 'superadmin@foliant.com', '$2a$10$f.i.hGz/T3z8C9/vU5yX.e2iYw/5j/QyGq2FvA9l8H.8qU5T1L4/W', 1, 'г. Москва, ул. Главная, д. 1, кв. 1', 0, '2025-06-21 17:19:02'),
(2, 'Иван Иванов', 'ivanov@example.com', '$2a$10$wTqKxQk6sC.B2V2t5L6FDO2t9w5P.7jYd.rZ0w4B/3qE9I7w8v9uK', 2, 'г. Санкт-Петербург, Невский пр-т, д. 28, кв. 5', 0, '2025-06-21 17:19:02'),
(3, 'Мария Петрова', 'petrova@example.com', '$2a$10$wTqKxQk6sC.B2V2t5L6FDO2t9w5P.7jYd.rZ0w4B/3qE9I7w8v9uK', 2, 'г. Новосибирск, ул. Ленина, д. 12, кв. 34', 0, '2025-06-21 17:19:02');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `publisher_id` (`publisher_id`);

--
-- Индексы таблицы `book_authors`
--
ALTER TABLE `book_authors`
  ADD PRIMARY KEY (`book_id`,`author_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Индексы таблицы `book_categories`
--
ALTER TABLE `book_categories`
  ADD PRIMARY KEY (`book_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Индексы таблицы `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_book_unique` (`user_id`,`book_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Индексы таблицы `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `special_offers`
--
ALTER TABLE `special_offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT для таблицы `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT для таблицы `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `publishers`
--
ALTER TABLE `publishers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `special_offers`
--
ALTER TABLE `special_offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `book_authors`
--
ALTER TABLE `book_authors`
  ADD CONSTRAINT `book_authors_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_authors_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `book_categories`
--
ALTER TABLE `book_categories`
  ADD CONSTRAINT `book_categories_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `special_offers`
--
ALTER TABLE `special_offers`
  ADD CONSTRAINT `special_offers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `special_offers_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
