import SigneeInformation from "../interfaces/SigneeInformation";
import Signer from "../interfaces/Signer";
import { LetterModel } from "../models/LetterModel";
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

    /**
     * Get information of signees for provided letter
     * 
     * @param letterId 
     * @returns SigneeInformation
     */
    async getAllSignersForLetterId(letterId: number): Promise<SigneeInformation> {
        if (letterId) {
            const signees = await SignerModel.find({ signing: letterId }) as unknown as Signer[] || [];
            const signeeCount = await SignerModel.find({ signing: letterId }).count();
            let names = [];
            signees.forEach(signer => {
                if (signer?.name) {
                    names.push(signer.name)
                }
            })
            const signeeInformation: SigneeInformation = {
                signeeCount: signeeCount,
                names: names,
                letterIdentifier: letterId
            }
            return signeeInformation
        } else {
            return null;
        }
    }

}
