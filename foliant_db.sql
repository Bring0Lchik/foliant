-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 22 2025 г., 21:59
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
(7, 'Федор Достоевский'),
(8, 'Дэниел Киз'),
(9, 'Роберт Хайнлайн'),
(10, 'Урсула К. Ле Гуин'),
(11, 'Филип К. Дик'),
(12, 'Станислав Лем'),
(13, 'Дэн Симмонс'),
(14, 'Уильям Гибсон'),
(15, 'Нил Стивенсон'),
(16, 'Джордж Р.Р. Мартин'),
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
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `books`
--

INSERT INTO `books` (`id`, `title`, `isbn`, `description`, `publisher_id`, `publication_year`, `pages`, `cover_image_path`, `price`, `stock_quantity`, `rating`) VALUES
(1, '1984', '978-5-17-080112-9', 'Культовый роман-антиутопия о тоталитарном обществе и Большом Брате.', 2, 2021, 320, '/images/covers/placeholder1.jpg', 450.00, 50, 0.00),
(2, 'Мастер и Маргарита', '978-5-389-01753-7', 'Величайший мистический роман XX века, полный сатиры, любви и философии.', 3, 2022, 480, '/images/covers/placeholder2.jpg', 620.00, 35, 0.00),
(3, 'Дюна', '978-5-17-135898-3', 'Первая книга из легендарного цикла о планете Арракис, специи и гигантских червях.', 1, 2021, 704, '/images/covers/placeholder2.jpg', 890.00, 25, 0.00),
(4, 'Пикник на обочине', '978-5-17-098553-9', 'Повесть о сталкерах и таинственной Зоне, полной опасных аномалий и бесценных артефактов.', 2, 2020, 256, '/images/covers/placeholder3.jpg', 380.00, 40, 0.00),
(5, 'Основание', '978-5-04-118831-2', 'Первый роман цикла о крушении Галактической Империи и плане психоисторика Гэри Селдона.', 1, 2023, 320, '/images/covers/placeholder1.jpg', 550.00, 30, 0.00),
(6, '451 градус по Фаренгейту', '978-5-04-094951-4', 'Антиутопия о будущем, где все книги подлежат сожжению, а пожарные их сжигают.', 1, 2018, 256, '/images/covers/placeholder2.jpg', 410.00, 60, 0.00),
(7, 'Преступление и наказание', '978-5-389-06517-0', 'История о метаниях души студента Раскольникова и границах морали.', 3, 2019, 608, '/images/covers/placeholder1.jpg', 580.00, 22, 0.00),
(8, 'Цветы для Элджернона', '978-5-04-096846-1', 'Трогательная история об эксперименте по повышению интеллекта, разуме и человечности.', 1, 2019, 320, '/images/covers/placeholder3.jpg', 490.00, 45, 0.00),
(9, 'Дверь в лето', '978-5-699-86132-7', 'Остроумная история инженера, который с помощью криосна и машины времени ищет справедливость.', 1, 2016, 288, '/images/covers/placeholder3.jpg', 430.00, 33, 0.00),
(10, 'Волшебник Земноморья', '978-5-389-07386-1', 'Начало великого цикла о магии, равновесии и становлении великого волшебника Геда.', 3, 2018, 288, '/images/covers/placeholder1.jpg', 510.00, 28, 0.00),
(11, 'Мечтают ли андроиды об электроовцах?', '978-5-699-82390-5', 'Нуарный киберпанк, послуживший основой для фильма \"Бегущий по лезвию\".', 1, 2017, 288, '/images/covers/placeholder3.jpg', 480.00, 18, 0.00),
(12, 'Солярис', '978-5-17-096057-4', 'Философская фантастика о контакте с разумным Океаном, который материализует потаенные воспоминания.', 2, 2021, 320, '/images/covers/placeholder3.jpg', 460.00, 29, 0.00),
(13, 'Гиперион', '978-5-17-105232-4', 'Космическая опера, построенная по принципу \"Кентерберийских рассказов\", где паломники рассказывают свои истории.', 2, 2019, 576, '/images/covers/placeholder1.jpg', 790.00, 15, 0.00),
(14, 'Нейромант', '978-5-389-08209-2', 'Роман, определивший каноны жанра \"киберпанк\". Матрица, хакеры, искусственный интеллект.', 3, 2020, 384, '/images/covers/placeholder3.jpg', 530.00, 21, 0.00),
(15, 'Лавина', '978-5-17-120530-0', 'Посткиберпанк о Метавселенной, вирусах, лингвистике и шумерской мифологии.', 2, 2021, 544, '/images/covers/placeholder1.jpg', 680.00, 24, 0.00),
(16, 'Игра престолов', '978-5-17-078518-4', 'Первая книга саги \"Песнь Льда и Пламени\". Интриги, войны и драконы в борьбе за Железный трон.', 2, 2019, 768, '/images/covers/placeholder2.jpg', 950.00, 40, 0.00),
(17, 'Ведьмак. Последнее желание', '978-5-17-093198-9', 'Сборник рассказов о ведьмаке Геральте из Ривии.', 2, 2019, 320, '/images/covers/placeholder2.jpg', 550.00, 60, 0.00),
(18, 'Властелин колец. Братство кольца', '978-5-17-108502-5', 'Начало величайшего фэнтези-эпоса о походе хоббитов для уничтожения Кольца Всевластия.', 2, 2021, 512, '/images/covers/placeholder1.jpg', 850.00, 50, 0.00),
(19, 'Цвет волшебства', '978-5-699-82662-3', 'Первая книга из цикла о Плоском мире, где магия реальна, а мир стоит на четырех слонах и черепахе.', 1, 2017, 352, '/images/covers/placeholder1.jpg', 480.00, 30, 0.00),
(20, 'Хроники Амбера. Девять принцев Амбера', '978-5-699-87355-9', 'Начало саги о королевской семье, способной путешествовать между мирами-отражениями.', 1, 2018, 224, '/images/covers/placeholder3.jpg', 420.00, 25, 0.00),
(21, 'Война и мир', '978-5-389-03399-5', 'Монументальный роман-эпопея о русском обществе в эпоху войн против Наполеона.', 3, 2020, 1344, '/images/covers/placeholder1.jpg', 1200.00, 18, 0.00),
(22, 'На Западном фронте без перемен', '978-5-17-088126-8', 'Антивоенный роман о \"потерянном поколении\" молодых людей, прошедших ужасы Первой мировой войны.', 2, 2019, 224, '/images/covers/placeholder2.jpg', 350.00, 45, 0.00),
(23, 'Сто лет одиночества', '978-5-17-080493-9', 'Магический реализм, рассказывающий историю семьи Буэндиа в мифическом городе Макондо.', 2, 2021, 480, '/images/covers/placeholder2.jpg', 610.00, 26, 0.00),
(24, 'Убить пересмешника', '978-5-17-092323-4', 'История о взрослении, расовых предрассудках и чести на юге Америки.', 2, 2020, 416, '/images/covers/placeholder2.jpg', 520.00, 38, 0.00),
(25, 'Над пропастью во ржи', '978-5-699-84739-0', 'Культовый роман о бунтующем подростке Холдене Колфилде и его неприятии взрослого мира.', 1, 2019, 288, '/images/covers/placeholder3.jpg', 450.00, 48, 0.00),
(26, 'Атлант расправил плечи', '978-5-9614-7264-9', 'Роман-бестселлер о предпринимателях и силе индивидуализма.', 5, 2020, 1168, '/images/covers/placeholder1.jpg', 1500.00, 20, 0.00),
(27, 'Источник', '978-5-9614-7331-8', 'Философский роман о творце-архитекторе, отстаивающем свою свободу.', 5, 2019, 752, '/images/covers/placeholder2.jpg', 950.00, 15, 0.00),
(28, 'Sapiens: Краткая история человечества', '978-5-905891-64-5', 'Научно-популярная книга об истории человеческого вида от каменного века до наших дней.', 4, 2016, 512, '/images/covers/placeholder1.jpg', 880.00, 55, 0.00),
(29, 'Homo Deus: Краткая история будущего', '978-5-907033-28-2', 'Продолжение Sapiens, исследующее будущее человечества.', 4, 2018, 496, '/images/covers/placeholder2.jpg', 890.00, 40, 0.00),
(30, 'Думай медленно... решай быстро', '978-5-17-080053-5', 'Книга нобелевского лауреата о двух системах мышления, управляющих нашей жизнью.', 2, 2013, 656, '/images/covers/placeholder1.jpg', 750.00, 60, 0.00),
(31, '7 навыков высокоэффективных людей', '978-5-9614-6816-1', 'Одна из самых влиятельных книг по саморазвитию.', 5, 2018, 396, '/images/covers/placeholder1.jpg', 680.00, 80, 0.00),
(32, 'Богатый папа, бедный папа', '978-985-15-3232-1', 'Книга, изменившая представление о деньгах и инвестировании у миллионов людей.', 1, 2017, 352, '/images/covers/placeholder1.jpg', 550.00, 70, 0.00),
(33, 'Илон Маск: Tesla, SpaceX и дорога в будущее', '978-5-389-13352-7', 'Биография одного из самых ярких визионеров нашего времени.', 3, 2017, 416, '/images/covers/placeholder2.jpg', 650.00, 30, 0.00),
(34, 'Стив Джобс', '978-5-17-083118-8', 'Авторизованная биография основателя Apple от Уолтера Айзексона.', 2, 2015, 656, '/images/covers/placeholder1.jpg', 990.00, 25, 0.00),
(35, 'От хорошего к великому', '978-5-00100-394-4', 'Исследование о том, почему одни компании совершают прорыв, а другие нет.', 4, 2017, 352, '/images/covers/placeholder3.jpg', 720.00, 40, 0.00),
(36, 'Черный лебедь. Под знаком непредсказуемости', '978-5-389-09608-2', 'Книга о влиянии случайных и непредсказуемых событий на нашу жизнь.', 3, 2015, 528, '/images/covers/placeholder2.jpg', 690.00, 35, 0.00),
(37, 'Антихрупкость. Как извлечь выгоду из хаоса', '978-5-389-11020-7', 'Продолжение идей \"Черного лебедя\" о системах, которые становятся сильнее от стресса.', 3, 2016, 768, '/images/covers/placeholder2.jpg', 850.00, 30, 0.00),
(38, 'Психология влияния', '978-5-496-03305-6', 'Классическая книга о механизмах убеждения и мотивации.', 1, 2018, 480, '/images/covers/placeholder2.jpg', 670.00, 50, 0.00),
(39, 'Поток: Психология оптимального переживания', '978-5-91657-857-4', 'Исследование состояния \"потока\", когда человек полностью поглощен деятельностью.', 4, 2013, 464, '/images/covers/placeholder2.jpg', 620.00, 28, 0.00),
(40, 'Выйди из зоны комфорта. Измени свою жизнь', '978-5-00100-748-5', '21 метод повышения личной эффективности.', 4, 2017, 128, '/images/covers/placeholder1.jpg', 350.00, 90, 0.00),
(41, 'Гибкое сознание', '978-5-00100-753-9', 'Книга о двух типах мышления - установке на данность и установке на рост.', 4, 2017, 304, '/images/covers/placeholder3.jpg', 580.00, 42, 0.00),
(42, 'Эмоциональный интеллект', '978-5-00100-802-4', 'Книга, которая популяризировала концепцию EQ.', 4, 2017, 544, '/images/covers/placeholder1.jpg', 780.00, 38, 0.00),
(43, 'Игры, в которые играют люди', '978-5-699-95982-6', 'Классика транзактного анализа от Эрика Берна.', 1, 2018, 256, '/images/covers/placeholder3.jpg', 450.00, 55, 0.00),
(44, 'Человек, который принял жену за шляпу', '978-5-17-092305-0', 'Занимательные истории из практики известного нейропсихолога Оливера Сакса.', 2, 2015, 352, '/images/covers/placeholder2.jpg', 530.00, 33, 0.00),
(45, 'Искусство любить', '978-5-17-089201-1', 'Философское эссе Эриха Фромма о любви как об искусстве, требующем знаний и усилий.', 2, 2016, 224, '/images/covers/placeholder3.jpg', 320.00, 65, 0.00),
(46, 'Бойня номер пять, или Крестовый поход детей', '978-5-17-094336-9', 'Антивоенный роман Курта Воннегута с элементами научной фантастики.', 2, 2016, 224, '/images/covers/placeholder2.jpg', 380.00, 41, 0.00),
(47, 'Заводной апельсин', '978-5-17-094625-4', 'Скандальный роман Энтони Бёрджесса о природе насилия и свободе воли.', 2, 2016, 256, '/images/covers/placeholder2.jpg', 390.00, 37, 0.00),
(48, 'Посторонний', '978-5-17-093892-4', 'Манифест экзистенциализма от Альбера Камю.', 2, 2015, 160, '/images/covers/placeholder3.jpg', 290.00, 52, 0.00),
(49, 'Тошнота', '978-5-17-093893-1', 'Философский роман Жан-Поля Сартра, ключевое произведение экзистенциализма.', 2, 2015, 256, '/images/covers/placeholder1.jpg', 340.00, 44, 0.00),
(50, 'Процесс', '978-5-389-04771-8', 'Абсурдистский роман Франца Кафки о человеке, попавшем в жернова безличной бюрократической машины.', 3, 2016, 288, '/images/covers/placeholder2.jpg', 410.00, 31, 0.00),
(51, 'Сияние', '978-5-17-087596-0', 'Один из самых знаменитых романов Стивена Кинга. История семьи, столкнувшейся со злом в отеле \"Оверлук\".', 2, 2022, 512, '/images/covers/placeholder3.jpg', 650.00, 25, 0.00),
(52, 'Автостопом по галактике', '978-5-17-094333-8', 'Юмористическая фантастика о приключениях Артура Дента после уничтожения Земли.', 1, 2020, 224, '/images/covers/placeholder3.jpg', 420.00, 40, 0.00),
(53, 'Задача трех тел', '978-5-04-100282-3', 'Первый роман трилогии \"Память о прошлом Земли\" китайского писателя Лю Цысиня.', 3, 2019, 464, '/images/covers/placeholder2.jpg', 710.00, 20, 0.00),
(54, 'Скотный двор', '978-5-17-093894-8', 'Аллегорическая повесть-притча Джорджа Оруэлла, опубликованная в 1945 году.', 2, 2021, 128, '/images/covers/placeholder3.jpg', 310.00, 55, 0.00),
(55, 'Гордость и предубеждение', '978-5-389-05834-9', 'Классический роман Джейн Остин о любви, репутации и классовых различиях в Англии XIX века.', 3, 2018, 416, '/images/covers/placeholder1.jpg', 530.00, 30, 0.00),
(56, 'Марсианин', '978-5-17-092923-6', 'Научно-фантастический роман Энди Вейера об астронавте, оставшемся в одиночестве на Марсе.', 1, 2015, 384, '/images/covers/placeholder3.jpg', 680.00, 28, 0.00),
(57, 'Старик и море', '978-5-17-095111-9', 'Повесть-притча Эрнеста Хемингуэя о героической и трагической борьбе старого кубинского рыбака с гигантской рыбой.', 2, 2017, 128, '/images/covers/placeholder3.jpg', 290.00, 60, 0.00),
(58, 'Вино из одуванчиков', '978-5-699-88339-8', 'Автобиографическая повесть Рэя Брэдбери, описывающая одно лето из жизни мальчика в американском городке.', 1, 2016, 288, '/images/covers/placeholder2.jpg', 480.00, 35, 0.00),
(59, 'Имя розы', '978-5-17-092576-4', 'Исторический детектив Умберто Эко, действие которого происходит в итальянском монастыре в 1327 году.', 3, 2018, 576, '/images/covers/placeholder2.jpg', 750.00, 18, 0.00),
(60, 'Моби Дик, или Белый кит', '978-5-389-07340-3', 'Роман Германа Мелвилла о маниакальной погоне капитана Ахава за гигантским белым кашалотом.', 4, 2019, 704, '/images/covers/placeholder3.jpg', 880.00, 15, 0.00),
(61, 'Лолита', '978-5-389-09413-2', 'Скандальный и стилистически совершенный роман Владимира Набокова.', 5, 2020, 416, '/images/covers/placeholder3.jpg', 610.00, 22, 0.00),
(62, 'Анна Каренина', '978-5-389-07505-6', 'Один из величайших романов Льва Толстого о трагической любви замужней женщины.', 3, 2017, 864, '/images/covers/placeholder1.jpg', 950.00, 25, 0.00),
(63, 'Братья Карамазовы', '978-5-389-07409-7', 'Последний и величайший роман Фёдора Достоевского, затрагивающий глубокие философские и духовные вопросы.', 2, 2018, 800, '/images/covers/placeholder2.jpg', 990.00, 20, 0.00),
(64, 'Гроздья гнева', '978-5-17-094895-1', 'Роман Джона Стейнбека о семье фермеров из Оклахомы, вынужденной мигрировать в Калифорнию во время Великой депрессии.', 1, 2016, 608, '/images/covers/placeholder2.jpg', 720.00, 28, 0.00),
(65, 'О дивный новый мир', '978-5-17-094648-3', 'Антиутопический роман Олдоса Хаксли о генетически детерминированном обществе будущего.', 2, 2019, 320, '/images/covers/placeholder3.jpg', 470.00, 45, 0.00),
(66, 'Алхимик', '978-5-17-087910-4', 'Притча Пауло Коэльо о путешествии андалузского пастуха Сантьяго в Египет.', 3, 2020, 224, '/images/covers/placeholder2.jpg', 510.00, 50, 0.00),
(67, 'Парфюмер. История одного убийцы', '978-5-389-09687-7', 'Роман Патрика Зюскинда о гениальном парфюмере и безжалостном убийце Жан-Батисте Гренуе.', 4, 2018, 320, '/images/covers/placeholder3.jpg', 590.00, 33, 0.00),
(68, 'Чума', '978-5-17-109673-1', 'Философский роман Альбера Камю, рассказывающий о жизни врачей и жителей города, охваченного эпидемией чумы.', 2, 2017, 352, '/images/covers/placeholder3.jpg', 490.00, 38, 0.00),
(69, 'Три товарища', '978-5-17-093153-8', 'Роман Эриха Марии Ремарка о дружбе, любви и жизни в Германии после Первой мировой войны.', 1, 2018, 480, '/images/covers/placeholder1.jpg', 550.00, 42, 0.00),
(70, 'Мозг. Краткое руководство', '978-5-00146-249-9', 'Книга от нейробиологов Дика Свааба и Майкла Газзанига, которая объясняет, как работает наш мозг.', 5, 2021, 288, '/images/covers/placeholder2.jpg', 810.00, 25, 0.00),
(71, 'Финансист', '978-5-389-13172-1', 'Первая часть \"Трилогии желания\" Теодора Драйзера о жизни и карьере амбициозного финансиста Фрэнка Каупервуда.', 3, 2019, 576, '/images/covers/placeholder2.jpg', 680.00, 20, 0.00),
(72, 'Загадка Эндхауза', '978-5-699-98555-9', 'Классический детектив Агаты Кристи с Эркюлем Пуаро в главной роли.', 2, 2020, 256, '/images/covers/placeholder1.jpg', 390.00, 48, 0.00),
(73, 'Собака Баскервилей', '978-5-389-08226-9', 'Одна из самых известных повестей Артура Конан Дойла о приключениях Шерлока Холмса и доктора Ватсона.', 1, 2021, 224, '/images/covers/placeholder3.jpg', 350.00, 55, 0.00),
(74, 'Контакт', '978-5-91671-888-9', 'Научно-фантастический роман Карла Сагана о первом контакте человечества с внеземной цивилизацией.', 4, 2018, 512, '/images/covers/placeholder3.jpg', 790.00, 19, 0.00),
(75, 'Эгоистичный ген', '978-5-17-093167-5', 'Книга Ричарда Докинза, популяризирующая геноцентричный взгляд на эволюцию.', 5, 2017, 512, '/images/covers/placeholder1.jpg', 850.00, 22, 0.00),
(76, 'Вокзал потерянных снов', '978-5-699-87358-0', 'Роман в жанре стимпанк и weird fiction от Чайны Мьевиля, действие которого разворачивается в гигантском городе Нью-Кробюзон.', 1, 2016, 704, '/images/covers/placeholder3.jpg', 820.00, 17, 0.00),
(77, 'Колыбель для кошки', '978-5-17-094337-6', 'Сатирический роман Курта Воннегута о конце света, вызванном веществом \"лёд-девять\".', 2, 2018, 256, '/images/covers/placeholder2.jpg', 460.00, 31, 0.00),
(78, 'Идиот', '978-5-389-05574-4', 'Роман Фёдора Достоевского о князе Мышкине, \"положительно прекрасном человеке\", вернувшемся в Россию.', 3, 2019, 640, '/images/covers/placeholder1.jpg', 610.00, 26, 0.00),
(79, 'К востоку от Эдема', '978-5-17-094191-4', 'Эпический роман Джона Стейнбека, пересказывающий библейскую историю Каина и Авеля на фоне истории двух семей в Калифорнии.', 1, 2017, 608, '/images/covers/placeholder1.jpg', 780.00, 19, 0.00),
(80, 'Мир, полный демонов: Наука как свеча во тьме', '978-5-91671-849-0', 'Книга Карла Сагана, посвященная защите научного метода и критического мышления.', 4, 2018, 536, '/images/covers/placeholder1.jpg', 880.00, 24, 0.00),
(81, 'Behave: Биология добра и зла', '978-5-00139-183-2', 'Книга Роберта Сапольски, исследующая биологические причины человеческого поведения, от хорошего до плохого.', 5, 2020, 768, '/images/covers/placeholder3.jpg', 1100.00, 15, 0.00),
(82, 'Звездный десант', '978-5-699-86134-1', 'Военно-фантастический роман Роберта Хайнлайна, исследующий темы гражданского долга и милитаризма.', 1, 2016, 320, '/images/covers/placeholder2.jpg', 490.00, 30, 0.00),
(83, 'Левая рука тьмы', '978-5-699-88195-0', 'Роман Урсулы Ле Гуин, исследующий темы пола, ксенофобии и общества на планете Гетен.', 2, 2017, 320, '/images/covers/placeholder3.jpg', 520.00, 27, 0.00),
(84, 'Убик', '978-5-699-82392-9', 'Психоделический роман Филипа Дика о группе людей с паранормальными способностями, реальность которых начинает распадаться.', 3, 2018, 224, '/images/covers/placeholder3.jpg', 450.00, 35, 0.00),
(85, 'Непобедимый', '978-5-17-096059-8', 'Научно-фантастический роман Станислава Лема о столкновении человеческого разума с нечеловеческой формой эволюции.', 1, 2021, 256, '/images/covers/placeholder2.jpg', 480.00, 29, 0.00),
(86, 'Падение Гипериона', '978-5-17-105233-1', 'Вторая книга тетралогии \"Песни Гипериона\" Дэна Симмонса, завершающая истории паломников.', 2, 2019, 608, '/images/covers/placeholder3.jpg', 810.00, 14, 0.00),
(87, 'Граф Монте-Кристо', '978-5-389-06830-0', 'Приключенческий роман Александра Дюма о мести, справедливости и прощении.', 3, 2018, 1248, '/images/covers/placeholder1.jpg', 1300.00, 18, 0.00),
(88, 'Криптономикон', '978-5-699-89736-4', 'Роман Нила Стивенсона, переплетающий истории криптографов времен Второй мировой войны и современных IT-специалистов.', 4, 2017, 960, '/images/covers/placeholder1.jpg', 1150.00, 12, 0.00),
(89, 'Буря мечей', '978-5-17-081105-0', 'Третья книга саги \"Песнь Льда и Пламени\" Джорджа Мартина, полная шокирующих поворотов.', 2, 2019, 960, '/images/covers/placeholder3.jpg', 1050.00, 32, 0.00),
(90, 'Кровь эльфов', '978-5-17-093199-6', 'Первый роман из саги о Ведьмаке Анджея Сапковского.', 1, 2019, 320, '/images/covers/placeholder3.jpg', 570.00, 50, 0.00),
(91, 'Хоббит, или Туда и обратно', '978-5-17-081102-9', 'Повесть Дж.Р.Р. Толкина, предшествующая событиям \"Властелина колец\".', 3, 2020, 256, '/images/covers/placeholder1.jpg', 620.00, 45, 0.00),
(92, 'Мор, ученик Смерти', '978-5-699-82663-0', 'Четвертая книга цикла \"Плоский мир\" Терри Пратчетта, где Смерть берет себе в ученики юношу по имени Мор.', 2, 2017, 320, '/images/covers/placeholder3.jpg', 490.00, 34, 0.00),
(93, 'Карты судьбы', '978-5-699-87356-6', 'Пятая книга \"Хроник Амбера\" Роджера Желязны, начинающая историю Мерлина, сына Корвина.', 1, 2018, 224, '/images/covers/placeholder3.jpg', 430.00, 26, 0.00),
(94, 'Смерть Ивана Ильича', '978-5-389-04183-4', 'Повесть Льва Толстого, исследующая темы жизни, смерти и смысла человеческого существования.', 3, 2019, 128, '/images/covers/placeholder2.jpg', 280.00, 58, 0.00),
(95, 'Триумфальная арка', '978-5-17-093154-5', 'Роман Эриха Марии Ремарка о немецком хирурге-беженце, живущем в Париже перед Второй мировой войной.', 2, 2018, 480, '/images/covers/placeholder2.jpg', 560.00, 39, 0.00),
(96, 'По ком звонит колокол', '978-5-17-095112-6', 'Роман Эрнеста Хемингуэя о гражданской войне в Испании.', 1, 2017, 544, '/images/covers/placeholder1.jpg', 690.00, 23, 0.00),
(97, 'Фиеста (И восходит солнце)', '978-5-17-095113-3', 'Первый значительный роман Эрнеста Хемингуэя о \"потерянном поколении\".', 2, 2018, 256, '/images/covers/placeholder3.jpg', 480.00, 31, 0.00),
(98, 'Великий Гэтсби', '978-5-17-094192-1', 'Роман Фрэнсиса Скотта Фицджеральда об эпохе джаза, американской мечте и неизбежной трагедии.', 3, 2019, 224, '/images/covers/placeholder1.jpg', 410.00, 47, 0.00),
(99, 'В дороге', '978-5-389-09414-9', 'Культовый роман Джека Керуака, ставший библией поколения битников.', 4, 2020, 384, '/images/covers/placeholder1.jpg', 530.00, 29, 0.00),
(100, 'Завтрак у Тиффани', '978-5-389-09688-4', 'Повесть Трумена Капоте о молодой и эксцентричной Холли Голайтли, живущей в Нью-Йорке.', 5, 2018, 160, '/images/covers/placeholder3.jpg', 390.00, 41, 0.00);

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
(25, 25),
(26, 1),
(27, 2),
(28, 3),
(29, 4),
(30, 5),
(31, 6),
(32, 7),
(33, 8),
(34, 9),
(35, 10),
(36, 11),
(37, 12),
(38, 13),
(39, 14),
(40, 15),
(41, 16),
(42, 17),
(43, 18),
(44, 19),
(45, 20),
(46, 21),
(47, 22),
(48, 23),
(49, 24),
(50, 25),
(51, 1),
(52, 2),
(53, 3),
(54, 4),
(55, 5),
(56, 6),
(57, 7),
(58, 8),
(59, 9),
(60, 10),
(61, 11),
(62, 12),
(63, 13),
(64, 14),
(65, 15),
(66, 16),
(67, 17),
(68, 18),
(69, 19),
(70, 20),
(71, 21),
(72, 22),
(73, 23),
(74, 24),
(75, 25),
(76, 1),
(77, 2),
(78, 3),
(79, 4),
(80, 5),
(81, 6),
(82, 7),
(83, 8),
(84, 9),
(85, 10),
(86, 11),
(87, 12),
(88, 13),
(89, 14),
(90, 15),
(91, 16),
(92, 17),
(93, 18),
(94, 19),
(95, 20),
(96, 21),
(97, 22),
(98, 23),
(99, 24),
(100, 25);

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
(50, 4),
(51, 2),
(52, 1),
(53, 1),
(54, 3),
(55, 4),
(56, 1),
(57, 4),
(58, 5),
(59, 6),
(60, 4),
(61, 5),
(62, 4),
(63, 4),
(64, 4),
(65, 1),
(65, 3),
(66, 5),
(67, 6),
(68, 4),
(69, 4),
(70, 7),
(71, 8),
(72, 6),
(73, 6),
(74, 1),
(75, 7),
(76, 1),
(76, 2),
(77, 1),
(78, 4),
(79, 4),
(80, 7),
(81, 7),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 4),
(88, 5),
(89, 2),
(90, 2),
(91, 2),
(92, 2),
(93, 2),
(94, 4),
(95, 4),
(96, 4),
(97, 4),
(98, 4),
(99, 5),
(100, 5);

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
(2, 1, 4, 1, 380.00);

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
  `promoted_to_admin_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role_id`, `delivery_address`, `is_blocked`, `promoted_to_admin_at`, `created_at`) VALUES
(1, 'Супер Админ', 'superadmin@foliant.com', '$2a$10$f.i.hGz/T3z8C9/vU5yX.e2iYw/5j/QyGq2FvA9l8H.8qU5T1L4/W', 1, 'г. Москва, ул. Главная, д. 1, кв. 1', 0, '2025-06-20 10:00:00', '2025-06-21 17:19:02'),
(2, 'Иван Иванов', 'ivanov@example.com', '$2a$10$wTqKxQk6sC.B2V2t5L6FDO2t9w5P.7jYd.rZ0w4B/3qE9I7w8v9uK', 2, 'г. Санкт-Петербург, Невский пр-т, д. 28, кв. 5', 0, NULL, '2025-06-21 17:19:02'),
(3, 'Мария Петрова', 'petrova@example.com', '$2a$10$wTqKxQk6sC.B2V2t5L6FDO2t9w5P.7jYd.rZ0w4B/3qE9I7w8v9uK', 2, 'г. Новосибирск, ул. Ленина, д. 12, кв. 34', 0, NULL, '2025-06-21 17:19:02');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
