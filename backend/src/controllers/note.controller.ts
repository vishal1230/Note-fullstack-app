// backend/src/controllers/note.controller.ts
import { Request, Response } from 'express';
import Note from '../models/note.model';

export const getNotes = async (req: Request, res: Response) => {
    try {
        const notes = await Note.find({ user: req.user?.id });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const createNote = async (req: Request, res: Response) => {
    const { content } = req.body;
    try {
        const newNote = new Note({
            content,
            user: req.user?.id,
        });
        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Make sure user owns the note
        if (note.user.toString() !== req.user?.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Note removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};