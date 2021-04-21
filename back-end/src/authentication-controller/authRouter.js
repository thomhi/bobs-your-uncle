import express from 'express';
import {postRegister, postToken, deleteToken} from './routes/authRoutes.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/register', postRegister);
router.post('/token', postToken);
router.delete('/token', deleteToken);

export default router;
