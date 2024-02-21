import type { Request, Response } from 'express'
import { MessageAck, MessageMedia, type Message } from 'whatsapp-web.js'
import { formatMessageAck } from '../../utils/formatter'

// TODO: This method is copy-pasted from the sendMessageToUser method in usersControllers.ts
// Need to create a seperate sendMessage function and use it in both usersControllers.ts and groupsControllers.ts
export async function sendMessageToGroup (req: Request, res: Response): Promise<void> {
  const message = req.body.message as string ?? ''
  const groupId: string = req.body.group_id as string ?? ''

  try {
    const group = await globalThis.client.getChatById(groupId)
    const files = req.files as Express.Multer.File[] ?? []
    const length = req.files?.length as number ?? 0

    if (length === 0) {
      const sentMessage = await group.sendMessage(message)
      const messageStatus = formatMessageAck(sentMessage.ack)

      if (sentMessage.ack === MessageAck.ACK_ERROR) {
        res.status(400).send({
          error: 'Message failed to send'
        })
        return
      }

      res.status(200).send({
        data: {
          status: messageStatus,
          ...sentMessage
        }
      })
      return
    }

    const sendAsDocument = Boolean(req.body.send_as_document) ?? false
    const responses: Message[] = []

    for (let i = 0; i < length; i++) {
      const file = MessageMedia.fromFilePath(files[i].path)
      file.mimetype = files[i].mimetype
      file.filename = files[i].originalname
      const sentMessage = await group.sendMessage(
        file,
        {
          caption: message,
          sendMediaAsDocument: sendAsDocument
        }
      )

      if (sentMessage.ack === MessageAck.ACK_ERROR) {
        res.status(400).send({
          error: 'Message failed to send'
        })
        return
      }
      responses.push(sentMessage)
    }
    res.status(200).send({
      data: responses
    })
  } catch (e) {
    console.log(e)
    res.status(500).send({
      error: {
        message: 'Failed to send message'
      }
    })
  }
}
