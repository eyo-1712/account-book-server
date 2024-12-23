import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { json, urlencoded } from 'express'
import morgan from 'morgan'
import { router } from './router'

dotenv.config({
  path: {
    development: './.env.development.local',
    production: './.env.production.local',
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

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
