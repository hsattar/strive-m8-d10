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
        mongoose.connection.close().then(done())
    })

    const validUserRegistration = {
        firstName: 'Hasan',
        lastName: 'Sattar',
        email: 'hasan@sattar.com',
        password: 'hasan'
    }

    it('Should create a new user with a hashed password but not returned', async () => {
        const response = await request.post('/users').send(validUserRegistration)
        expect(response.status).toBe(201)
        expect(response.body._id).toBeDefined()
        expect(response.body.password).not.toBeDefined()
    })

})