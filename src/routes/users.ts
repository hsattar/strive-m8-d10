import { Router, RequestHandler } from 'express'
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

export default userRouter