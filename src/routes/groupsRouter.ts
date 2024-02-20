import { Router } from 'express'
import { sendMessageToGroup } from '../controllers/groupsControllers'
import isClientReady from '../middleware/clientMiddlewares'
import messageFormatVerify from '../middleware/messageMiddlewares'

const router = Router()

router.post('/sendMessage', isClientReady, messageFormatVerify, sendMessageToGroup)

export default router
