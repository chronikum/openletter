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
basicRoutes.get('/verification/:code', async (request, response) => {
    var verificationCode = request.params?.code;
    var email = request.params?.email;
    if (verificationCode) {
        let verification = VerificationManager.instance.checkToken(verificationCode);
        if (verification) {
            response.send("Danke für die Bestätigung!")
        } else {
            response.send({ success: false })
        }
    }
});



export default basicRoutes;