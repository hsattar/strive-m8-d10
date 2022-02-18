import { Router, RequestHandler } from 'express'
import createHttpError from 'http-errors'
import UserModel from '../models/usersSchema'

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
        const user = UserModel.authenticate(email, password)
        if (!user) return next(createHttpError(401, 'Invalid Credentials'))
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default userRouter