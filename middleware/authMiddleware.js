const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// checkUser теперь принимает `next` и ОБЯЗАТЕЛЬНО вызывает его в конце
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next(); // <-- Вызываем next в любом случае
            } else {
                try {
                    const user = await User.findById(decodedToken.id);
                    if (user) {
                        res.locals.user = user;
                        req.user = user;
                    } else {
                        res.locals.user = null;
                    }
                    next(); // <-- Вызываем next в любом случае
                } catch (dbError) {
                    console.error('Ошибка в checkUser:', dbError);
                    res.locals.user = null;
                    next(); // <-- Вызываем next в любом случае
                }
            }
        });
    } else {
        res.locals.user = null;
        next(); // <-- Вызываем next в любом случае
    }
};

// ... остальные функции requireAuth и requireAdmin без изменений ...
const requireAuth = (req, res, next) => {
    if (!res.locals.user) {
        const returnTo = req.originalUrl;
        return res.redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    if (res.locals.user.role_id !== 1) {
        return res.status(403).render('pages/403', { title: 'Доступ запрещен' });
    }
    next();
};


module.exports = { checkUser, requireAuth, requireAdmin };