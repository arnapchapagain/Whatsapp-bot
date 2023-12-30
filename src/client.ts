import { Client, LocalAuth, Message } from 'whatsapp-web.js';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/session'
    })
});

client.on('message', async (message: Message) => {
	console.log(message.body);

    if(message.body === '!ping') {
		message.reply('pong');
	}
});


export default client;