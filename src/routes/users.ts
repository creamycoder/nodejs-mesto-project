import { Router } from 'express';
import { createUser, getUsers, getUserById, updateProfile, updateAvatar, getCurrentUser } from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;