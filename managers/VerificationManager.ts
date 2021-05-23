import crypto from 'crypto'
import Mail from 'nodemailer/lib/mailer';
import Letter from '../interfaces/Letter';
import Signer from '../interfaces/Signer';
import { MailManager } from './MailManager';
import SignerManager from './SignerManager';

export class VerificationManager {
    static instance = VerificationManager.getInstance();

    public static getInstance(): VerificationManager {
        if (!VerificationManager.instance) {
            VerificationManager.instance = new VerificationManager();
        }

        return VerificationManager.instance;
    }


    // Token holder
    userTokens = [];

    /**
     * Creates a new verification challenge and sends out the mail
     * @param signer 
     */
    async createNewVerificationChallenge(signer: Signer, letter: Letter) {
        const generatedToken = crypto.randomBytes(12).toString('hex');
        const verificationChallenge = {
            signer: signer,
            token: generatedToken,
        };

        MailManager.instance.sendVerificationEmail(signer, generatedToken, letter);

        this.processVerificationChallengeRequest(signer, verificationChallenge);
    }

    /**
     * Checks token for validation
     * @param token
     * @param email
     * 
     * -> Will also update the user as valid signee
     */
    checkToken(token: string): boolean {
        const available = this.userTokens.find((pair) => (pair.token === token));
        if (available) {
            const signer = available.signer;
            SignerManager.instance.validateSigner(signer);
        }
        return !!available;
    }

    /**
     * Process the reset request
     *
     * - sends mail
     * - adds the reset token to the list
     * - checks if the user is ldap
     */
    processVerificationChallengeRequest(user: Signer, verificationChallenge: any) {
        if (user?.email && user?.signing) {
            this.addVerificationToken(verificationChallenge.token, user);
        }
    }

    /**
     * Add reset token to the non persistent array
     */
    addVerificationToken(token: string, signer: Signer) {
        const created = Date.now();
        this.userTokens.push({
            token, signer, created,
        });
    }

    /**
     * This function, called once, will periodically check for expired tokens and remove them.
     * - the function runs every 5 minutes
     * - tokens are valid for 20 minutes
     */
    clearExpiredTokens() {
        setInterval(() => {
            // Find all tokens to delete and flag them
            this.userTokens.forEach((token) => {
                const timeLeft = token.created - Date.now();
                if (timeLeft < -3600000) { // 20 minutes passed
                    token.created = 0;
                }
            });
            // Remove all tokens which were flagged for deletion
            this.userTokens = this.userTokens.filter((token) => token.created !== 0);
        }, 300000);
    }
}