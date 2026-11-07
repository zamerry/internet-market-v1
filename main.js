import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRouter from "./server/routers/user.router.js"
import productsRouter from './server/routers/products.router.js'
import errorMiddleware from "./middlewares/error.middleware.js"

dotenv.config()

const port = process.env.port || 5000

const app = express()
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:63342'
}))
app.use(cookieParser())
app.use('/shit', userRouter)
app.use('/shop', productsRouter)
app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`сервер работает на порту ${port}`)
})