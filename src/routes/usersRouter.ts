import { Router } from 'express'
import multer from 'multer'
import * as os from 'os'
import { getMe, sendMessageToUser, verifyNumber } from '../controllers/usersControllers'
import isClientReady from '../middleware/clientMiddlewares'
import messageFormatVerify from '../middleware/messageMiddlewares'
import numberFormater from '../middleware/numberMiddlewares'

const upload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: 2048 * 1024 * 1024 }
})

const router = Router()

router.get('/me', isClientReady, getMe)
router.post('/verify', isClientReady, numberFormater, verifyNumber)
router.post(
  '/sendMessage',
  isClientReady,
  numberFormater,
  messageFormatVerify,
  upload.any(),
  sendMessageToUser
)

export default router
