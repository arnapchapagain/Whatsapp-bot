import { Router } from 'express'
import { getMe } from '../controllers/usersControllers'
import isClientReady from '../middleware/clientReadyMiddleware'

const router = Router()

router.get('/me', isClientReady, getMe)

export default router
