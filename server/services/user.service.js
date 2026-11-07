import db from '../database/db.js'
import {v4} from 'uuid'
import UserDto from "../user.dto.js"
import bcrypt from 'bcryptjs'
import MailService from "./inner-services/mail.service.js"
import ApiError from "../exceptions/api.error.js"
import TokensService from "./inner-services/tokens.service.js"

class UserService {

    async registration(email, password) {

        const candidate = await db.query(
            'select * from profile where email = $1', [email]
        )

        if (candidate.rows.length > 0) {
            throw ApiError.badRequest("пользователь с такой электронной почтой уже существует")
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const activatedLink = v4()
        await MailService.sendMail(email, `${process.env.api_url}/shit/activate/${activatedLink}`)

        const user = await db.query(
            'insert into profile (email, profile_password, activation_link) values($1, $2, $3) returning *', [email, hashPassword, activatedLink]
        )

        const userData = new UserDto(user.rows[0])
        const tokens = await TokensService.generateTokens({...userData})
        await TokensService.saveToken(userData.id, tokens.refreshToken)

        return {
            user: userData,
            ...tokens
        }

    }

    async activate(activationLink) {
        const userLink = await db.query(
            'select * from profile where activation_link = $1', [activationLink]
        )

        if (userLink <= 0) {
            throw ApiError.badRequest("нету ссылки для активации")
        }

        const updateStatus = await db.query(
            'update profile set is_active = true where id_profile = $1 returning *', [userLink.rows[0].id_profile]
        )

        return updateStatus.rows[0]

    }

    async login(email, password) {
        const user = await db.query(
            'select * from profile where email = $1', [email]
        )

        if (user.rows.length <= 0) {
            throw ApiError.badRequest("пользователь с такой электронной почтой не зарегистрирован")
        }

        const dbUser = user.rows[0]

        const comparePassword = await bcrypt.compare(password, dbUser.profile_password)
        if (!comparePassword) {
            throw ApiError.badRequest("неправильный пароль")
        }

        const userData = new UserDto(dbUser)
        const tokens = await TokensService.generateTokens({...userData})
        await TokensService.saveToken(userData.id, tokens.refreshToken)

        return {
            user: userData,
            ...tokens
        }

    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unAuthorization()
        }

        const validateToken = await TokensService.validateRefreshToken(refreshToken)
        const findFromDb = await TokensService.findToken(refreshToken)

        console.log(findFromDb)

        if (!validateToken || !findFromDb) {
            throw ApiError.unAuthorization()
        }

        const user = await db.query(
            'select * from profile where email = $1', [validateToken.email]
        )

        const userData = new UserDto(user.rows[0])
        const tokens = await TokensService.generateTokens({...userData})
        await TokensService.saveToken(userData.id, tokens.refreshToken)

        return {
            user: userData,
            ...tokens
        }

    }

    async logout(refreshToken) {
        const user = await TokensService.deleteToken(refreshToken)
        return user
    }

    async getAllUsers() {
        const users = await db.query(
            'select * from profile'
        )

        return users.rows

    }
}

export default new UserService()