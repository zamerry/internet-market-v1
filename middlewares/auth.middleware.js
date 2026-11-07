import ApiError from "../server/exceptions/api.error.js";
import TokensService from "../server/services/inner-services/tokens.service.js";

const authMiddleware = async (req, res, next) => {

    try {
        if (req.method === 'OPTIONS') {
            return next()
        }

        const getToken = req.headers.authorization

        if (!getToken) {
            return next(ApiError.badRequest("токен не найден"))
        }

        const isValid = getToken.split(" ")[1]
        if (!isValid) {
            return next(ApiError.badRequest("неккоректный токен"))
        }

        const userData = await TokensService.validateAccessToken(isValid)
        if (!userData) {
            return next(ApiError.badRequest("неккоректный токен, скорее всего уже истек"))
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.badRequest())
    }

}

export default authMiddleware