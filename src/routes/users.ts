import { Router } from 'express';
import { getUsers, getUserById, updateUser, updateAvatar, getCurrentUser } from '../controllers/users';
import { validateUserId, validateUpdateProfile, validateUpdateAvatar } from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;