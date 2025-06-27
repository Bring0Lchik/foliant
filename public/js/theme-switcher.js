document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    const sunIcon = 'fa-sun';
    const moonIcon = 'fa-moon';

    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (themeToggleButton) {
            const icon = themeToggleButton.querySelector('i');
            if (currentTheme === 'dark') {
                icon.classList.remove(sunIcon);
                icon.classList.add(moonIcon);
            } else {
                icon.classList.remove(moonIcon);
                icon.classList.add(sunIcon);
            }
        }
    } else { // Default to light theme if no preference is stored
        document.body.setAttribute('data-theme', 'light');
         if (themeToggleButton) {
            const icon = themeToggleButton.querySelector('i');
            icon.classList.remove(moonIcon);
            icon.classList.add(sunIcon);
        }
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            const icon = themeToggleButton.querySelector('i');

            if (theme === 'dark') {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                icon.classList.remove(moonIcon);
                icon.classList.add(sunIcon);
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                icon.classList.remove(sunIcon);
                icon.classList.add(moonIcon);
            }
        });
    }
});
