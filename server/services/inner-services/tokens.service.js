import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import db from '../../database/db.js'
import ApiError from "../../exceptions/api.error.js";

class TokensService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.secret_access_key, {expiresIn: "1h"})
        const refreshToken = jwt.sign(payload, process.env.secret_refresh_key, {expiresIn: "30d"})

        return {accessToken, refreshToken}
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await db.query(
            'select * from tokens where id_token = $1', [userId]
        )

        if (tokenData > 0) {
            const updateToken = await db.query(
                'update tokens set refresh_token = $1 where id_token = $2', [refreshToken, userId]
            )
            return updateToken.rows[0]
        }

        const createToken = await db.query(
            'insert into tokens (user_id, refresh_token) values($1, $2) returning *', [userId, refreshToken]
        )

        return createToken.rows[0]

    }

    async deleteToken(refreshToken) {

        if (!refreshToken) {
            throw ApiError.unAuthorization()
        }

        const token = await db.query(
            'delete from tokens where refresh_token = $1 returning *', [refreshToken]
        )

        return token.rows[0]

    }

    async findToken(refreshToken) {
        const token = await db.query(
            'select * from tokens where refresh_token = $1', [refreshToken]
        )

        return token.rows[0]

    }

    async validateRefreshToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.secret_refresh_key)
            return tokenData
        } catch (e) {
            return null
        }
    }

    async validateAccessToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.secret_access_key)
            return tokenData
        } catch (e) {
            return null
        }
    }

}

export default new TokensService()