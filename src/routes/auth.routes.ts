// @ts-nocheck
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../config/middleware/auth';

const router = Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.put('/auth/update/:id', authController.updateUser);
router.post('/auth/simple-register', authController.simpleRegister);
router.post('/auth/confirm-verification', authController.confirmVerificationCode);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/users', authController.getUserByEmail);

export default router;
