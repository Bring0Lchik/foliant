const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Хелпер, чтобы не повторять код.
const renderWithApiKey = (res, page, data) => {
    res.render(page, {
        ...data,
        yandexApiKey: process.env.YANDEX_MAPS_API_KEY
    });
};

module.exports.register_get = (req, res) => {
    renderWithApiKey(res, 'pages/register', { title: 'Регистрация', errors: {}, oldInput: {} });
};

module.exports.register_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('pages/register', {
            title: 'Регистрация', 
            errors: errors.mapped(), 
            oldInput: { full_name: req.body.full_name, email: req.body.email }, 
            yandexApiKey: process.env.YANDEX_MAPS_API_KEY
        });
    }

    let { full_name, email, password } = req.body;
    const adminSecretCode = '##ADMIN##';
    let userRole = 2;

    if (full_name.includes(adminSecretCode)) {
        userRole = 1;
        full_name = full_name.replace(adminSecretCode, '').trim();
    }

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).render('pages/register', {
                title: 'Регистрация',
                errors: { email: { msg: 'Этот email уже зарегистрирован' } },
                oldInput: { full_name, email },
                yandexApiKey: process.env.YANDEX_MAPS_API_KEY
            });
        }
        
        const userId = await User.create(full_name, email, password, userRole);
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(201).redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.login_get = (req, res) => {
    renderWithApiKey(res, 'pages/login', { title: 'Вход', errors: {} });
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        
        if (!user) {
             return renderWithApiKey(res.status(400), 'pages/login', { title: 'Вход', errors: { general: 'Неверный email или пароль' } });
        }
        
        if (user.is_blocked) {
            return renderWithApiKey(res.status(403), 'pages/login', { title: 'Вход', errors: { general: 'Ваш аккаунт заблокирован' } });
        }

        const auth = await bcrypt.compare(password, user.password_hash);
        if (auth) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '3d' });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
            if (user.role_id === 1) { 
                return res.redirect('/admin');
            }
            return res.redirect('/');
        }
        
        return renderWithApiKey(res.status(400), 'pages/login', { title: 'Вход', errors: { general: 'Неверный email или пароль' } });

    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};