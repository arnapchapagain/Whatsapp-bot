import type { Request, Response } from 'express'
import { MessageAck } from 'whatsapp-web.js'

export async function getMe (req: Request, res: Response): Promise<void> {
  const me = globalThis.client.info.wid
  const name = globalThis.client.info.pushname
  const platform = globalThis.client.info.platform
  const chats = await globalThis.client.getChats()
  const groups = chats.filter(chat => chat.isGroup)
  res.status(200).send({
    ...me,
    name,
    platform,
    chats,
    groups
  })
}

export async function verifyNumber (req: Request, res: Response): Promise<void> {
  const isValid = await client.isRegisteredUser(req.body.number as string)
  const statusCode = isValid ? 200 : 400
  res.status(statusCode).send({
    is_valid: isValid
  })
}

export async function sendMessageToUser (req: Request, res: Response): Promise<void> {
  const message = req.body.message as string ?? ''
  const number: string = req.body.number as string ?? ''

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
