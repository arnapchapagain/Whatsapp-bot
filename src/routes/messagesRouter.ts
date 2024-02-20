import { Router } from 'express'
import { sendMessageToUser } from '../controllers/messagesControllers'
import isClientReady from '../middleware/clientMiddlewares'
import numberFormater from '../middleware/numberMiddlewares'

const router = Router()

router.post('/send', isClientReady, numberFormater, sendMessageToUser)

export default router
