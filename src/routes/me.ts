import { Router } from 'express'
import createHttpError from 'http-errors'
import UserModel from '../models/usersSchema'
import HouseModal from '../models/houseSchema'

const meRouter = Router()

meRouter.get('/', async (req, res, next) => {
    try {
        const me = await UserModel.findById(req.user._id, { refreshToken: 0 })
        if (!me) return next(createHttpError(404, 'User not found'))
        res.send(me)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

meRouter.get('/houses', async (req, res, next) => {
    try {
        const houses = await HouseModal.find({ host: req.user._id })
        res.send(houses)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default meRouter