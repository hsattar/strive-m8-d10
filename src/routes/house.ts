import { Router } from 'express'
import HouseModal from '../models/houseSchema'

const accomodationRouter = Router()

accomodationRouter.route('/')
.get(async (req, res, next) => {
    try {
        const houses = await HouseModal.find()
        res.send(houses)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.post(async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

accomodationRouter.route('/:id')
.get(async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default accomodationRouter