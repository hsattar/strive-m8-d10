import { Router } from 'express'
import createHttpError from 'http-errors'
import HouseModal from '../models/houseSchema'

const accomodationRouter = Router()

accomodationRouter.route('/')
.get(async (req, res, next) => {
    try {
        const houses = await HouseModal.find().populate('host', { refreshToken: 0 })
        res.send(houses)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.post(async (req, res, next) => {
    try {
        const house = new HouseModal(req.body)
        await house.save()
        res.status(201).send(house)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

accomodationRouter.route('/:id')
.get(async (req, res, next) => {
    try {
        const house = await HouseModal.findById(req.params.id).populate('host', { refreshToken: 0 })
        if (!house) return next(createHttpError(404, 'House not found'))
        res.send(house)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        const house = await HouseModal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!house) return next(createHttpError(404, 'House not found'))
        res.send(house)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        const result = await HouseModal.findByIdAndDelete(req.params.id)
        if (!result) return next(createHttpError(404, 'House not found'))
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default accomodationRouter