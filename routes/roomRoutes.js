import express from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, checkAvailability } from '../controllers/roomController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getRooms);
router.get('/check-availability', checkAvailability);
router.get('/:id', getRoomById);
router.post('/', protect, admin, upload.array('images', 5), createRoom);
router.put('/:id', protect, admin, upload.array('images', 5), updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

export default router;
