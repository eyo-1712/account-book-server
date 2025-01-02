import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { json, urlencoded } from 'express'
import session from 'express-session'
import morgan from 'morgan'
import { redisStore } from './config/redis'
import { router } from './router'
import { handleError } from './utils/handle-error'

dotenv.config({
  path: {
    development: './.env.development',
    production: './.env.production',
  }[process.env.NODE_ENV!],
})

const server = express()
const port = process.env.PORT

if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'))
}

server.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET ?? '',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true },
  }),
)

if (process.env.NODE_ENV === 'production') {
  server.set('trust proxy', 1)
}

server.use(json())
server.use(urlencoded({ extended: true }))
server.use(cors())
server.use(cookieParser())

server.use('/api', router)
server.use(handleError)

server.listen(port)
