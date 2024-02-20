import { Router } from 'express'
import { sendMessage } from '../controllers/messagesControllers'
import isClientReady from '../middleware/clientMiddlewares'
import numberFormater from '../middleware/numberMiddlewares'

const router = Router()

router.post('/send', isClientReady, numberFormater, sendMessage)

export default router
