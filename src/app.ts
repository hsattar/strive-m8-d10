import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from "./routes/users"
import accomodationRouter from "./routes/house"
import { errorHandlers } from "./middlewares/errorHandlers"
import { authenticateUser } from "./middlewares/authentication"
import meRouter from "./routes/me"

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/users', userRouter)
app.use('/me', meRouter)
app.use('/houses', accomodationRouter)

app.use(errorHandlers)

export default app