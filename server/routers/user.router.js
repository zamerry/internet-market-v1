import {Router} from "express"
import UserController from "../controllers/user.controller.js"
import {body} from "express-validator"
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = new Router()

router.post('/registration',
    body('email', 'неправильный формат электронной почты').isEmail(),
    body('email', 'электроная почта не может быть пустой').notEmpty(),
    body('password', 'пароль не может быть пустым').notEmpty(),
    body('password', 'минимальная длина пароля 3 символа').isLength({min: 3}),
    UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)

router.get('/refresh', UserController.refresh)
router.get('/activate/:link', UserController.activate)
router.get('/users', authMiddleware, UserController.getAllUsers)

export default router