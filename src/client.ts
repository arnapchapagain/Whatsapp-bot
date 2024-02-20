import { Client, LocalAuth } from 'whatsapp-web.js'

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: '/session'
  })
})

client.on('message', (message) => {
  console.log(message.body)

  if (message.body === '!ping') {
    message.reply('pong').catch(err => { console.error(err) })
  }
})

export default client
