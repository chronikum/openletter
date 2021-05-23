import express from "express";
import { VerificationManager } from "../managers/VerificationManager";

const basicRoutes = express.Router();

/**
 * Version Info
 */
basicRoutes.get('/', async (request, response) => {
    response.send({ success: true, message: "You are running on openletters v0.0.1" })
});


/**
 * Verification Code
 */
basicRoutes.get('/sample/:code:email', async (request, response) => {
    var verificationCode = request.params?.code;
    var email = request.params?.email;
    if (verificationCode) {
        let verification = VerificationManager.instance.checkToken(verificationCode, email);
        if (verification) {
            response.send(`
            <meta charset="utf-8>
            <p>Deine E-Mail wurde bestätigt!</p>
            `)
        } else {
            response.send(`
            <meta charset="utf-8>
            <p>Ungültiger oder abgelaufer Code. Codes sind maximal eine Stunde gültig.</p>
            `)
        }
    }
    response.send({ success: true, message: "You are running on openletters v0.0.1" })
});



export default basicRoutes;