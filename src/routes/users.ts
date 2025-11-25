import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, updateAvatar, getCurrentUser } from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;