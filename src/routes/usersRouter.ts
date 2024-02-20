import { Router } from 'express'
import { getMe, sendMessageToUser, verifyNumber } from '../controllers/usersControllers'
import isClientReady from '../middleware/clientMiddlewares'
import messageFormatVerify from '../middleware/messageMiddlewares'
import numberFormater from '../middleware/numberMiddlewares'

const router = Router()

router.get('/me', isClientReady, getMe)
router.post('/verify', isClientReady, numberFormater, verifyNumber)
router.post('/sendMessage', isClientReady, numberFormater, messageFormatVerify, sendMessageToUser)

export default router
