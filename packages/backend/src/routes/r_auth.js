import { Router } from 'express'
import { auth_controller } from '../controllers/c_auth.js';

export const authRouter = Router()

authRouter.post('/login', auth_controller)
