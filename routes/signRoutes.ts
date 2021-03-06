import express from "express";
import Letter from "../interfaces/Letter";
import Signer from "../interfaces/Signer";
import LetterManager from "../managers/LetterManager";
import SignerManager from "../managers/SignerManager";
import { VerificationManager } from "../managers/VerificationManager";

const signRoutes = express.Router();

/**
 * Signs a petition and triggers verification email
 */
signRoutes.post('/sign', async (request, response) => {
    const signer = request.body?.signer as Signer;
    if (signer?.signing && signer?.email) {
        const letter = await LetterManager.instance.getLetterById(signer.signing);
        if (letter && signer) {
            const validSigner = await SignerManager.instance.createNewSigner(signer);
            if (validSigner) {
                response.send({ success: true })
            } else {
                response.send({ success: false })
            }
        } else {
            response.send({ success: false })
        }
    } else {
        response.send({ success: false })
    }
});

/**
 * Get all signees for the provided letter
 */
signRoutes.post('/getInfo', async (request, response) => {
    const providedLetter = request.body?.letter as Letter;
    if (providedLetter?.identifier) {
        const signeeInformation = await SignerManager.instance.getAllSignersForLetterId(providedLetter.identifier);
        if (signeeInformation) {
            response.send({ success: true, signeeInformation })
        } else {
            response.send({ success: false })
        }
    } else {
        response.send({ success: false })
    }
});

export default signRoutes;