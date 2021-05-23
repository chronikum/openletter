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
                host: process.env.HOST,
                port: process.env.PORT,
                secure: process.env.SECURE, // true for 465, false for other ports
                auth: {
                    user: process.env.USERNAME, // generated ethereal user
                    pass: process.env.PASSWORD, // generated ethereal password
                },
            });
            console.log(this.transporter)
            return Promise.resolve(this.transporter);
        } catch {
            console.log("Something went wrogn!")
            return null;
        }
    }

    /**
     * This will send the user an email informing them that a reservation request got accepted
     *
     * @param User
     * @param Reservation
     */
    async sendTestMail(signer: Signer) {
        await this.createTransport();
        try {
            const testMailStatus = await this.transporter.sendMail({
                from: `"OpenLetter" <${process.env.USERNAME}>`, // sender address
                to: `${signer.email} <${signer.email}>`, // list of receivers
                subject: 'Bitte bestätige deine Unterschrift!', // Subject line
                html: 'Hallo Welt :) Das ist eine Test-Email!',
            });
        } catch {
            console.log("Connection failed")
        }
    }
}