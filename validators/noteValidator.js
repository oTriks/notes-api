import Joi from 'joi';

export const createNoteSchema = Joi.object({
    title: Joi.string().max(50).required(),
    text: Joi.string().max(300).required(),
});

export const updateNoteSchema = Joi.object({
    noteId: Joi.string().required(),
    title: Joi.string().max(50).required(),
    text: Joi.string().max(300).required(),
});

export const deleteNoteSchema = Joi.object({
    noteId: Joi.string().required(),
});
