// backend/src/routes/note.routes.ts
import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/note.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All these routes are protected
router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').delete(protect, deleteNote);

export default router;