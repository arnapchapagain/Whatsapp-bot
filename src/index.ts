import express, {Request, Response} from 'express';
import { Message, MessageAck } from 'whatsapp-web.js';
import client from './client';
import qrcode from 'qrcode-terminal';
import clientReadyMiddleware from './middleware/clientReadyMiddleware';
import numberVerifyMiddleware from './middleware/numberVerifyMiddleware';

const app = express();
app.use(express.json());

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
});


client.on('authenticated', () => {
    globalThis.IS_AUTHENTICATED = true;
    console.log('Client is authenticated!');
});


client.on('authentication_failure', () => {
    console.log('Auth failure!');
});

client.on('message_ack', (message: Message, ack: MessageAck) => {
    let sentTo = '+' + message.to.replace('@c.us', '');
    let messageId = message.id.id;
    if (ack === MessageAck.ACK_ERROR){
        console.log(`Message ${messageId} sent to ${sentTo} failed to send`);
    }
    else if (ack === MessageAck.ACK_PENDING){
        console.log(`Message ${messageId} sent to ${sentTo} is pending to be seen`);
    }
    else if (ack === MessageAck.ACK_SERVER){
        console.log(`Message ${messageId} sent to ${sentTo} was sent by the server`);
    }
    else if (ack === MessageAck.ACK_DEVICE){
        console.log(`Message ${messageId} sent to ${sentTo} was received on the device`);
    }
    else if (ack === MessageAck.ACK_READ){
        console.log(`Message ${messageId} sent to ${sentTo} was read by the recipient`);
    }
    else if (ack === MessageAck.ACK_PLAYED){
        console.log(`Message ${messageId} sent to ${sentTo} was played by the recipient`);
    }
    else {
        console.log(`Message ${messageId} sent to ${sentTo} has an unknown ack`);
    }
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


app.post('/is_valid', clientReadyMiddleware, numberVerifyMiddleware, async (req: Request, res: Response) => {
    let isValid = await client.isRegisteredUser(req.body.number as string);
    let statusCode = isValid ? 200 : 400;
    res.status(statusCode).send({
        is_valid: isValid
    });
});


app.post('/send_message', clientReadyMiddleware, numberVerifyMiddleware, async (req: Request, res: Response) => {
    if (!req.body.message){
        return res.status(400).send({
            error: 'Missing message on request body'
        });
    }

    var number: string = req.body.number as string;
    var message: string = req.body.message as string;

    if (message.length === 0) {
        return res.status(400).send({
            error: 'Message is empty'
        });
    }
    if (message.length > 4096) {
        return res.status(400).send({
            error: 'Message is too long. Max length is 4096 characters'
        });
    }

    let isValid = await client.isRegisteredUser(req.body.number as string);
    if (!isValid) {
        return res.status(400).send({
            error: 'Number is not registered on Whatsapp'
        });
    }

    let sentMessage = await client.sendMessage(number, message);
    let messageId: object = sentMessage.id;
    let sentTo: string = sentMessage.to;

    var messageStatus = '';
    switch (sentMessage.ack) {
        case MessageAck.ACK_ERROR:
            messageStatus = 'Failed to send';
            break;
        case MessageAck.ACK_PENDING:
            messageStatus = 'Pending to be seen';
            break;
        case MessageAck.ACK_SERVER:
            messageStatus = 'Server';
            break;
        case MessageAck.ACK_DEVICE:
            messageStatus = 'Device';
            break;
        case MessageAck.ACK_READ:
            messageStatus = 'Read by recipient';
            break;
        case MessageAck.ACK_PLAYED:
            messageStatus = 'Played by recipient';
            break;
    }

    if (sentMessage.ack == MessageAck.ACK_ERROR) {
        return res.status(400).send({
            error: 'Message failed to send'
        });
    }

    res.status(200).send({
        status: messageStatus,
        sent_to: sentTo,
        message_id: messageId,
    });


});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
})

