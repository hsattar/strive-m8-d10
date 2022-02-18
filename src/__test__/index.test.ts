import dotenv from 'dotenv'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'

dotenv.config()
const request = supertest(app)
const { DB_URL_TEST } = process.env

if (!DB_URL_TEST) throw new Error('Add Environment Variables')

describe('Testing all the user routes', () => {

    beforeAll(done => {
        mongoose.connect(DB_URL_TEST, () => {
            console.log('Connected to DB')
            done()
        })
    })

    afterAll(done => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(done())
    })

    const validUserRegistration = {
        firstName: 'Hasan',
        lastName: 'Sattar',
        email: 'hasan@sattar.com',
        password: 'hasan'
    }

    const validLogin = {
        email: 'hasan@sattar.com',
        password: 'hasan'
    }

    const cookies = {
        accessToken: '',
        refreshToken: ''
    }

    const validHouseRequest = {
        name: "Test",
        host: "",
        description: "Some random description",
        maxGuests: 2
    }

    const editedHouseDetails = {
        name: "Edited",
        maxGuests: 5
    }

    let houseId: string

    it('Should create a new user with a hashed password but not returned', async () => {
        const response = await request.post('/users').send(validUserRegistration)
        expect(response.status).toBe(201)
        expect(response.body._id).toBeDefined()
        expect(response.body.password).not.toBeDefined()
        validHouseRequest.host = response.body._id
    })

    it('should get all the houses listed', async () => {
        const response = await request.get('/houses')
        expect(response.status).toBe(200)
    })

    it('should add a new house', async () => {
        const response = await request.post('/houses').send(validHouseRequest)
        expect(response.status).toBe(201)
        expect(response.body._id).toBeDefined()
        houseId = response.body._id
    })

    it('should be able to get a specific house', async () => {
        const response = await request.get(`/houses/${houseId}`)
        expect(response.status).toBe(200)
        expect(response.body._id).toBe(houseId)
    })

    it('should be able to edit the house details', async () => {
        const response = await request.put(`/houses/${houseId}`).send(editedHouseDetails)
        expect(response.status).toBe(200)
        expect(response.body.name).not.toBe(validHouseRequest.name)
        expect(response.body.maxGuests).not.toBe(validHouseRequest.maxGuests)
    })

    it('should be able to delete a house', async () => {
        const response = await request.delete(`/houses/${houseId}`)
        expect(response.status).toBe(204)
    })

})