import express, { type Request, type Response } from 'express'

import client from './client'
import clientReadyMiddleware from './middleware/clientMiddlewares'

import { exit } from 'process'
import messagesRouter from './routes/messagesRouter'
import usersRouter from './routes/usersRouter'

const app = express()
app.use(express.json())
app.use('/users', usersRouter)
app.use('/messages', messagesRouter)

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
