import express from "express";
import Letter from "../interfaces/Letter";
import LetterManager from "../managers/LetterManager";

/**
 * Basic Routes
 */
const letterRoutes = express.Router();

/**
 * Get all letters
 */
letterRoutes.post('/getAll', async (request, response) => {
    const letters = await LetterManager.instance.getAllLetters();
    response.send({ success: true, letters });
});

/**
 * Create a new letter
 */
letterRoutes.post('/create', async (request, response) => {
    const letter = request.body?.letter as Letter;
    if (letter) {
        const createdLetter = await LetterManager.instance.createNewLetter(letter);
        response.send({ success: true, message: "Letter created", letter: createdLetter })
    } else {
        response.send({ success: false })
    }
});

/**
 * Get letter by id
 */
letterRoutes.post('/getAll', async (request, response) => {
    const identifier = request.body?.identifier;
    if ((identifier instanceof Number) && (identifier > 0)) {
        const letter = await LetterManager.instance.getLetterById(identifier as number);
        response.send({ success: true, letter })
    } else {
        response.send({ success: false })
    }
});

export default letterRoutes; // Export basic routes