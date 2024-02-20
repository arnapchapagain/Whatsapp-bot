import { Router } from 'express'
import { getMe, verifyNumber } from '../controllers/usersControllers'
import isClientReady from '../middleware/clientMiddlewares'
import numberFormater from '../middleware/numberMiddlewares'

const router = Router()

router.get('/me', isClientReady, getMe)
router.post('/verify', isClientReady, numberFormater, verifyNumber)

export default router
