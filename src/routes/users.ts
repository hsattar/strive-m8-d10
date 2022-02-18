import { Router, RequestHandler } from 'express'
import createHttpError from 'http-errors'
import UserModel from '../models/usersSchema'
import { IUserDoc } from '../types/userInterface'
import { createNewTokens } from '../utils/jwt'

const userRouter = Router()

userRouter.post('/', async (req, res, next) => {
    try {
        const user = new UserModel(req.body)
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

userRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body as { email: string, password: string }
        if (!email || !password) return next(createHttpError(400, 'Please Provide Email & Password'))
        const user = await UserModel.authenticate(email, password)
        if (!user) return next(createHttpError(401, 'Invalid Credentials'))
        const { accessToken, refreshToken } = await createNewTokens(user as IUserDoc)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        })
        res.send('Tokens Sent')
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default userRouter