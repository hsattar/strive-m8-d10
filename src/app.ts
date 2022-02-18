import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from "./routes/users"
import { errorHandlers } from "./middlewares/errorHandlers"

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/users', userRouter)

app.use(errorHandlers)

export default app