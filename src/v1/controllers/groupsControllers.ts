import type { Request, Response } from 'express'
import { MessageAck } from 'whatsapp-web.js'

export async function sendMessageToGroup (req: Request, res: Response): Promise<void> {
  const message = req.body.message as string ?? ''
  const groupId: string = req.body.group_id as string ?? ''

  try {
    const group = await globalThis.client.getChatById(groupId)
    const sentMessage = await group.sendMessage(message)
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
  } catch {
    res.status(404).send({
      error: {
        message: 'Group not found'
      }
    })
  }
}
