import Letter from "../interfaces/Letter";
import Signer from "../interfaces/Signer";

const nodemailer = require('nodemailer');

/**
 * Mail Manager
 */
export class MailManager {

    static instance = MailManager.getInstance();

    public static getInstance(): MailManager {
        if (!MailManager.instance) {
            require('dotenv').config()
            MailManager.instance = new MailManager();
        }

        return MailManager.instance;
    }

    configuration: any;
    transporter: any;

    /**
     * Creates a nodemailer transport
     * - loads new variables
     */
    async createTransport(): Promise<any> {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP,
                port: process.env.PORT,
                secure: process.env.SECURE, // true for 465, false for other ports
                auth: {
                    user: process.env.USERNAME,
                    pass: process.env.PASSWORD,
                },
            });
            return Promise.resolve(this.transporter);
        } catch {
            console.log("Something went wrong!")
            return null;
        }
    }

    /**
     * This will send the user an email informing them that a reservation request got accepted
     *
     * @param signer 
     * @param verificationCode
     */
    async sendVerificationEmail(signer: Signer, verificationCode: string, letter: Letter) {
        await this.createTransport();
        const host = process.env.HOST;
        try {
            const testMailStatus = await this.transporter.sendMail({
                from: `"OpenLetter" <${process.env.USERNAME}>`, // sender address
                to: `${signer.email} <${signer.email}>`, // list of receivers
                subject: 'Bitte bestätige deine Unterschrift!', // Subject line
                html: `Hallo! Toll, dass du den offenen Brief<br>
                <b>${letter.title}</b><br> unterstützen willst.<br>Klicke auf den Button, um deinen Account zu bestätigen!<br>
                <button style="background: white; color: black"><a style="font-size: 2em; background: white; color: black" href="https://${host}/verification/${verificationCode}">Jetzt bestätigen!</a></button><br>
                Mit klimafreundlichen Grüßen<br>
                Dein OpenLetters-Team`,
            });
        } catch {
            console.log("Connection failed")
        }
    }
}