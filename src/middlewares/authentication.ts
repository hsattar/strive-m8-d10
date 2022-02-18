import { RequestHandler } from "express"
import createHttpError from "http-errors"
import { verifyJwtToken } from "../utils/jwt"

const { ACCESS_TOKEN_SECRET: ATS } = process.env

export const authenticateUser: RequestHandler = async (req, res, next) => {
    const { accessToken } = req.cookies
    if (!accessToken) return next(createHttpError(401, 'Credentials not sent.'))
    const user = await verifyJwtToken(accessToken, ATS!)
    if (!user) return next(createHttpError(401, 'Invalid Details'))
    req.user = user
    next()
}