import UserService from "../services/user.service.js"
import {validationResult} from "express-validator"

class UserController {
    async registration(req, res, next) {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.json({
                    message: "найдены ошибки",
                    errors: errors.array()
                })
            }

            const {email, password} = req.body
            const user = await UserService.registration(email, password)
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.json({
                    message: "найдены ошибки",
                    errors: errors.array()
                })
            }

            const {email, password} = req.body
            const user = await UserService.login(email, password)
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const user = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect(process.env.client_url)
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController()