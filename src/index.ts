import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import express, {Request, Response} from 'express';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/session'
    })
});
const app = express();


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message: Message) => {
	console.log(message.body);

    if(message.body === '!ping') {
		message.reply('pong');
	}
});

client.initialize();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


app.listen(3000, () => {
    console.log('Server started!');
})

