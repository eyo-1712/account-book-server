import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'

dotenv.config({
  path: {
    development: './.env.development.local',
    production: './.env.production.local',
  }[process.env.NODE_ENV!],
})

const app = express()
const port = process.env.PORT

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
