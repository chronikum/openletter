import Signer from "../interfaces/Signer";
import { SignerModel } from "../models/SignerModel";
import LetterManager from "./LetterManager";
import { VerificationManager } from "./VerificationManager";

export default class SignerManager {
    static instance = SignerManager.getInstance();

    public static getInstance(): SignerManager {
        if (!SignerManager.instance) {
            SignerManager.instance = new SignerManager();
        }

        return SignerManager.instance;
    }

    /**
     * Creates a new signer
     * - only if not existing already
     * - sends out verification email
     * 
     * @param Signer
     */
    async createNewSigner(signer: Signer): Promise<Signer> {
        if (signer.email && signer.signing) {
            const signerExists = await this.signerExists(signer);
            const letter = await LetterManager.instance.getLetterById(signer.signing);
            if (!signerExists && letter) {
                const signerCount = await SignerModel.count() || 0;
                signer.verified = false; // Always false at the beginning
                signer.identifier = (signerCount + 1)
                // Create and save new signer
                const signerModel = new SignerModel(signer);
                await signerModel.save();
                VerificationManager.instance.createNewVerificationChallenge(signer, letter);
                return await SignerModel.findOne({ email: signer.email, signing: signer.signing }) as unknown as Signer
            } else {
                return null
            }
        } else {
            return null
        }
    }

    /**
     * Validates Signer after e-mail validation
     */
    async validateSigner(signer: Signer) {
        const verified = await SignerModel.updateOne({ email: signer.email, signing: signer.signing }, {
            verified: true
        })
    }

    /**
     * Checks if a email signing this specific letter is already in the system
     * 
     * @param signer
     * @returns boolean
     */
    async signerExists(signer: Signer): Promise<boolean> {
        const newSigner = await SignerModel.findOne({
            email: signer.email,
            signing: signer.signing
        }) as unknown as Signer;
        if (newSigner) {
            return true
        } else {
            return false
        }
    }
}
