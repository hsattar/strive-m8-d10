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

    const fakeId = '999999999999999999999999'

    const validUserRegistration = {
        firstName: 'Hasan',
        lastName: 'Sattar',
        email: 'hasan@sattar.com',
        password: 'hasan'
    }

    const invalidUserRegistration = {
        firstName: 'Hasan',
        lastName: 'Sattar',
        email: 'hasan@sattar.com'
    }

    const validLogin = {
        email: 'hasan@sattar.com',
        password: 'hasan'
    }

    const invalidLogin = {
        email: 'hasan@sattar.com',
        password: 'hello'
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

    const invalidHouseRequest = {
        name: "Test",
        host: "",
        description: "Some random description"
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

    it('should return a 400 status if a user registers without enough details', async () => {
        const response = await request.post('/users').send(invalidUserRegistration)
        expect(response.status).toBe(400)
        expect(response.body.message).toBeDefined()
    })

    it('should return a 401 status if a user logs in with incorrect details', async () => {
        const response = await request.post('/users/login').send(invalidLogin)
        expect(response.status).toBe(401)
        // expect(response.body).toBe('Invalid Credentials)
    })

    // HOUSES TESTS

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

    it('should return a status 400 when adding a house without all the details', async () => {
        const response = await request.post('/houses').send(invalidHouseRequest)
        expect(response.status).toBe(400)
        expect(response.body.message).toBeDefined()
    })

    it('should be able to get a specific house', async () => {
        const response = await request.get(`/houses/${houseId}`)
        expect(response.status).toBe(200)
        expect(response.body._id).toBe(houseId)
    })

    it('should return a 404 status for a house ID that does not exist on GET /houses/:id', async () => {
        const response = await request.get(`/houses/${fakeId}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toBeDefined()
    })

    it('should be able to edit the house details', async () => {
        const response = await request.put(`/houses/${houseId}`).send(editedHouseDetails)
        expect(response.status).toBe(200)
        expect(response.body.name).not.toBe(validHouseRequest.name)
        expect(response.body.maxGuests).not.toBe(validHouseRequest.maxGuests)
    })

    it('should return a 404 status for a house ID that does not exist PUT /houses/:id', async () => {
        const response = await request.put(`/houses/${fakeId}`).send(editedHouseDetails)
        expect(response.status).toBe(404)
        expect(response.body.message).toBeDefined()
    })

    it('should be able to delete a house', async () => {
        const response = await request.delete(`/houses/${houseId}`)
        expect(response.status).toBe(204)
        expect(response.body).not.toBe({})
    })

    it('should return a 404 status for a house ID that does not exist DELETE /houses/:id', async () => {
        const response = await request.delete(`/houses/${fakeId}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toBeDefined()
    })

})