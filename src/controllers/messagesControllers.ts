import type { Request, Response } from 'express'
import { MessageAck } from 'whatsapp-web.js'

export async function sendMessageToUser (req: Request, res: Response): Promise<void> {
  const message = req.body.message as string ?? ''
  const number: string = req.body.number as string ?? ''

  if (message === '') {
    res.status(400).send({
      error: 'Missing message on request body'
    })
    return
  }

  if (message.length === 0) {
    res.status(400).send({
      error: 'Message is empty'
    })
    return
  }
  if (message.length > 4096) {
    res.status(400).send({
      error: 'Message is too long. Max length is 4096 characters'
    })
    return
  }

  const isValid = await client.isRegisteredUser(req.body.number as string)
  if (!isValid) {
    res.status(400).send({
      error: 'Number is not registered on Whatsapp'
    })
    return
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
    res.status(400).send({
      error: 'Message failed to send'
    })
    return
  }

  res.status(200).send({
    status: messageStatus,
    sent_to: sentTo,
    message_id: messageId
  })
}
