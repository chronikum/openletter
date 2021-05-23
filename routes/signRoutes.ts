import express from "express";
import Letter from "../interfaces/Letter";
import Signer from "../interfaces/Signer";
import LetterManager from "../managers/LetterManager";
import { VerificationManager } from "../managers/VerificationManager";

const signRoutes = express.Router();

/**
 * Signs a petition and triggers verification email
 */
signRoutes.post('/sign', async (request, response) => {
    const signer = request.body?.signer as Signer;
    console.log(request.body)
    if (signer?.signing && signer?.email) {
        const letter = await LetterManager.instance.getLetterById(signer.signing);
        console.log(letter)
        if (letter && signer) {
            VerificationManager.instance.createNewVerificationChallenge(signer);
            response.send({ success: true })
        } else {
            response.send({ success: false })
        }
    } else {
        response.send({ success: false })
    }
});

export default signRoutes;