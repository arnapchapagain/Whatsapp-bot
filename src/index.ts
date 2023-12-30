import express, {Request, Response} from 'express';
import { Chat } from 'whatsapp-web.js';
import client from './client';
import qrcode from 'qrcode-terminal';
import clientReadyMiddleware from './middleware/clientReadyMiddleware';

const app = express();

client.initialize();

declare global {
    var IS_READY: boolean;
    var IS_AUTHENTICATED: boolean;
}

globalThis.IS_READY = false;
globalThis.IS_AUTHENTICATED = false;


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('ready', async () => {
    console.log('Client is ready!');
    globalThis.IS_READY = true;

    let chats: Chat[] = await client.getChats();
    chats.forEach(chat => {
        console.log(chat.name);
    });
});


client.on('authenticated', () => {
    globalThis.IS_AUTHENTICATED = true;
    console.log('Client is authenticated!');
});


client.on('authentication_failure', () => {
    console.log('Auth failure!');
});


app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!');
});


app.get('/status', clientReadyMiddleware, async (req: Request, res: Response) => {
    res.status(200).send({
        message: 'Client is ready and authenticated'
    });
});


app.get('/me', clientReadyMiddleware, async (req: Request, res: Response) => {
    let me = await client.info.wid;
    res.status(200).send({
        me: me
    });
});
 

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
})

