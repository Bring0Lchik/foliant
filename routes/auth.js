const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = Router();

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

// Добавляем валидацию
router.get('/register', authController.register_get);
router.post(
    '/register',
    [
        body('full_name', 'Поле ФИО не должно быть пустым').notEmpty().trim(),
        body('email', 'Введите корректный email').isEmail().normalizeEmail(),
        body('password')
            .isLength({ min: 12 }).withMessage('Пароль должен содержать минимум 12 символов')
            .matches(/\d/).withMessage('Пароль должен содержать хотя бы одну цифру')
            .matches(/[a-z]/).withMessage('Пароль должен содержать хотя бы одну строчную латинскую букву')
            .matches(/[A-Z]/).withMessage('Пароль должен содержать хотя бы одну заглавную латинскую букву')
            .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Пароль должен содержать хотя бы один специальный символ')
    ],
    authController.register_post
);

module.exports = router;