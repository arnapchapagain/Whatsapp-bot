import express, { type Request, type Response } from 'express'

import bodyParser from 'body-parser'
import { exit } from 'process'
import { version as apiVersion } from '../package.json'

import client from './client'
import clientReadyMiddleware from './v1/middleware/clientMiddlewares'
import { basicErrorHandler } from './v1/middleware/errorMiddlewares'
import groupsRouter from './v1/routes/groupsRouter'
import usersRouter from './v1/routes/usersRouter'

const app = express()
app.use(bodyParser.json({
  verify: (req, res, buf, enc) => {
    try {
      JSON.parse(buf.toString())
    } catch (e) {
      throw new Error('Invalid JSON')
    }
  }
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(basicErrorHandler)
app.use(`/${apiVersion}/users`, usersRouter)
app.use(`/${apiVersion}/groups`, groupsRouter)

client.initialize()
  .then(() => {
    console.log('Client initialized!')
  })
  .catch(err => {
    console.error('Error initializing client', err)
    exit(1)
  })

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/status', clientReadyMiddleware, (req: Request, res: Response) => {
  res.status(200).send({
    message: 'Client is ready and authenticated'
  })
})

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
