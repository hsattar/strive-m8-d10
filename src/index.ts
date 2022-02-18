import mongoose from 'mongoose'
import app from './app'

const { PORT, DB_URL } = process.env

if (!PORT || !DB_URL) throw new Error('Add Environment variables')

mongoose.connect(DB_URL)

mongoose.connection.on('connected', () => {
    console.log('Connected to db')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})