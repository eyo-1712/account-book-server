import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { json, urlencoded } from 'express'
import morgan from 'morgan'
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

server.use(json())
server.use(urlencoded({ extended: true }))
server.use(cors())
server.use(cookieParser())

server.use('/api', router)
server.use(handleError)

server.listen(port)
