import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import UserModel from '../models/usersSchema'
import { IUserDoc } from '../types/userInterface'

const { ACCESS_TOKEN_SECRET: ATS, REFRESH_TOKEN_SECRET: RTS} = process.env as { ACCESS_TOKEN_SECRET: string, REFRESH_TOKEN_SECRET: string}

// if (!ATS || !RTS) throw new Error('Add Environment Variables')

export interface IPayload {
    _id: string
}

export const createNewTokens = async (user: IUserDoc) => {
    try {
        const accessToken = await generateJwtToken({_id: user._id }, ATS, '15 m')
        const refreshToken = await generateJwtToken({_id: user._id }, RTS, '1 week')
        user.refreshToken = refreshToken
        await user.save()
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw new Error('Something went wrong creating the tokens')        
    }
}

const generateJwtToken = (payload: IPayload, secret: string, expiresIn: string): Promise<string> => new Promise((resolve, reject) => 
jwt.sign(payload, secret, { expiresIn }, (err, token) => {
    if (err) return reject(err)
    resolve(token as string)
}))

export const verifyJwtToken = (token: string, secret: string): Promise<IPayload> => new Promise((resolve, reject) =>
jwt.verify(token, secret, (err, payload) => {
    if (err) return reject(err)
    resolve(payload as IPayload)
}))

export const verifyRefreshTokenAndGenerateNewTokens = async (token: string) => {
    try {
        const { _id } = await verifyJwtToken(token, RTS)
        if (!_id) throw createHttpError(401, 'Invalid Details')
        const user = await UserModel.findById(_id)
        if (!user) throw createHttpError(404, 'User not found')
        const { accessToken, refreshToken } = await createNewTokens(user)
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw createHttpError(401, 'Invalid Details')
    }
}