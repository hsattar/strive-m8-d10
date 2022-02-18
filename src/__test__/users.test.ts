import supertest from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from '../app'

const request = supertest(app)
const { DB_URL_TEST } = process.env
dotenv.config()

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

})