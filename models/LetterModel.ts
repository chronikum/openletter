import mongoose, { Schema } from 'mongoose';

const letterSchema = new Schema({
    identifier: Number,
    title: String,
    description: String
});

export const LetterModel = mongoose.model('Letter', letterSchema);