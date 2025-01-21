import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import session from 'express-session'
import morgan from 'morgan'
import { UID_KEY } from './config/cookie'
import { redisStore } from './config/redis'
import { router } from './router'
import { handleError } from './utils/handle-error'

const server = express()
const port = process.env.PORT

if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'))
}

server.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET ?? '',
    resave: true,
    saveUninitialized: false,
    cookie: {
      // secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일,
      signed: true,
    },
    name: UID_KEY,
  }),
)

if (process.env.NODE_ENV === 'production') {
  server.set('trust proxy', 1)
}

server.use(json())
server.use(urlencoded({ extended: true }))
server.use(cors())
server.use(cookieParser(process.env.SESSION_SECRET, {}))

server.use('/api', router)
server.use(handleError)

server.listen(port)
