import express, { type Request, type Response } from 'express'
import { exit } from 'process'
import qrcode from 'qrcode-terminal'
import { MessageAck, type Client, type Message } from 'whatsapp-web.js'

import client from './client'
import clientReadyMiddleware from './middleware/clientReadyMiddleware'
import numberVerifyMiddleware from './middleware/numberVerifyMiddleware'
import usersRouter from './routes/usersRouter'

const app = express()
app.use(express.json())
app.use('/users', usersRouter)

client.initialize()
  .catch(err => {
    console.error('Error initializing client', err)
  })

declare global {
  // var is mandatory for the global object
  // eslint-disable-next-line no-var
  var IS_READY: boolean
  // eslint-disable-next-line no-var
  var IS_AUTHENTICATED: boolean
  // eslint-disable-next-line no-var
  var client: Client
}

globalThis.IS_READY = false
globalThis.IS_AUTHENTICATED = false
globalThis.client = client

client.on('qr', qr => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('Client is ready!')
  globalThis.IS_READY = true
})

client.on('authenticated', () => {
  globalThis.IS_AUTHENTICATED = true
  console.log('Client is authenticated!')
})

client.on('authentication_failure', () => {
  console.log('Auth failure!')
  exit(1)
})

client.on('message_ack', (message: Message, ack: MessageAck) => {
  const sentTo = '+' + message.to.replace('@c.us', '')
  const messageId = message.id.id
  if (ack === MessageAck.ACK_ERROR) {
    console.log(`Message ${messageId} sent to ${sentTo} failed to send`)
  } else if (ack === MessageAck.ACK_PENDING) {
    console.log(`Message ${messageId} sent to ${sentTo} is pending to be seen`)
  } else if (ack === MessageAck.ACK_SERVER) {
    console.log(`Message ${messageId} sent to ${sentTo} was sent by the server`)
  } else if (ack === MessageAck.ACK_DEVICE) {
    console.log(`Message ${messageId} sent to ${sentTo} was received on the device`)
  } else if (ack === MessageAck.ACK_READ) {
    console.log(`Message ${messageId} sent to ${sentTo} was read by the recipient`)
  } else if (ack === MessageAck.ACK_PLAYED) {
    console.log(`Message ${messageId} sent to ${sentTo} was played by the recipient`)
  } else {
    console.log(`Message ${messageId} sent to ${sentTo} has an unknown ack`)
  }
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/status', clientReadyMiddleware, (req: Request, res: Response) => {
  res.status(200).send({
    message: 'Client is ready and authenticated'
  })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/is_valid', clientReadyMiddleware, numberVerifyMiddleware, async (req: Request, res: Response) => {
  const isValid = await client.isRegisteredUser(req.body.number as string)
  const statusCode = isValid ? 200 : 400
  res.status(statusCode).send({
    is_valid: isValid
  })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/send_message', clientReadyMiddleware, numberVerifyMiddleware, async (req: Request, res: Response) => {
  const message = req.body.message as string ?? ''
  const number: string = req.body.number as string ?? ''

  if (message === '') {
    return res.status(400).send({
      error: 'Missing message on request body'
    })
  }

  if (message.length === 0) {
    return res.status(400).send({
      error: 'Message is empty'
    })
  }
  if (message.length > 4096) {
    return res.status(400).send({
      error: 'Message is too long. Max length is 4096 characters'
    })
  }

  const isValid = await client.isRegisteredUser(req.body.number as string)
  if (!isValid) {
    return res.status(400).send({
      error: 'Number is not registered on Whatsapp'
    })
  }

  const sentMessage = await client.sendMessage(number, message)
  const messageId: object = sentMessage.id
  const sentTo: string = sentMessage.to

  let messageStatus = ''
  switch (sentMessage.ack) {
    case MessageAck.ACK_ERROR:
      messageStatus = 'Failed to send'
      break
    case MessageAck.ACK_PENDING:
      messageStatus = 'Pending to be seen'
      break
    case MessageAck.ACK_SERVER:
      messageStatus = 'Server'
      break
    case MessageAck.ACK_DEVICE:
      messageStatus = 'Device'
      break
    case MessageAck.ACK_READ:
      messageStatus = 'Read by recipient'
      break
    case MessageAck.ACK_PLAYED:
      messageStatus = 'Played by recipient'
      break
  }

  if (sentMessage.ack === MessageAck.ACK_ERROR) {
    return res.status(400).send({
      error: 'Message failed to send'
    })
  }

  res.status(200).send({
    status: messageStatus,
    sent_to: sentTo,
    message_id: messageId
  })
})

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
