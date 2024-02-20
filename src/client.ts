import { Client, LocalAuth, type Message } from 'whatsapp-web.js'
import JsonDb from './utils/db'

const db = new JsonDb<Message>('/session/messages.json')

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: '/session'
  })
})

client.on('message', (message) => {
  console.log(message.body)
  db.insertOne(message)
  db.commit()

  if (message.body === '!ping') {
    message.reply('pong').catch(err => { console.error(err) })
  }
})

export default client
