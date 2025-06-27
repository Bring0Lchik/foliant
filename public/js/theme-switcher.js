document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    // Используем Font Awesome классы для иконок
    const sunIconClass = 'fa-sun';
    const moonIconClass = 'fa-moon';

    // Функция для применения темы и обновления иконки
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggleButton) {
            const icon = themeToggleButton.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove(sunIconClass);
                icon.classList.add(moonIconClass);
                themeToggleButton.setAttribute('title', 'Переключить на светлую тему');
            } else {
                icon.classList.remove(moonIconClass);
                icon.classList.add(sunIconClass);
                themeToggleButton.setAttribute('title', 'Переключить на темную тему');
            }
        }
    }

    // Получаем сохраненную тему или системные предпочтения
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        // Если нет сохраненной темы, проверяем системные предпочтения
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light'; // По умолчанию светлая тема
        }
    }

    // Применяем тему при загрузке страницы
    applyTheme(currentTheme);

    // Обработчик клика по кнопке
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'dark') {
                applyTheme('light');
            } else {
                applyTheme('dark');
            }
        });
    }

    // Слушаем изменения системных предпочтений (опционально, для автоматического переключения)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Переключаем тему только если пользователь не выбрал ее вручную (нет записи в localStorage)
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
});
