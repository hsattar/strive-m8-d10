import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from "./routes/users"

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/users', userRouter)

export default app