import Signer from "../interfaces/Signer";
import { SignerModel } from "../models/SignerModel";
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
        if (signer.email && signer.identifier) {
            const signerExists = await this.signerExists(signer);
            if (!signerExists) {
                signer.verified = false; // Always false at the beginning
                const signerModel = new SignerModel(signer);
                VerificationManager.instance.createNewVerificationChallenge(signer);
                await signerModel.save();
                return await SignerModel.findOne({ email: signer.email, signing: signer.signing }) as unknown as Signer
            } else {
                return null
            }
        }
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
