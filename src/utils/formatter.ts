import { MessageAck } from 'whatsapp-web.js'

export function formatMessageAck (ack: MessageAck): string {
  let messageStatus = ''
  switch (ack) {
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
  return messageStatus
}
