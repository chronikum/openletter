import Letter from "../interfaces/Letter";
import { LetterModel } from "../models/LetterModel";

export default class LetterManager {
    static instance = LetterManager.getInstance();

    public static getInstance(): LetterManager {
        if (!LetterManager.instance) {
            LetterManager.instance = new LetterManager();
        }

        return LetterManager.instance;
    }

    /**
     * Creates a new letter
     * 
     * @param Letter
     * @returns Letter
     */
    async createNewLetter(letter: Letter): Promise<Letter> {
        const count = await LetterModel.count() || 0;
        letter.identifier = (count + 1);
        const newLetter = new LetterModel(letter);
        await newLetter.save();
        return await LetterModel.findOne({ identifier: (count + 1) }) as unknown as Letter;
    }

    /**
     * Gets all letters
     * 
     * @returns Letter[]
     */
    async getAllLetters(): Promise<Letter[]> {
        return await LetterModel.find({}) as unknown as Letter[];
    }

    /**
     * Get a letter by a identifer
     * 
     * @param identifier of letter
     * @returns 
     */
    async getLetterById(identifier: number): Promise<Letter> {
        return await LetterModel.findOne({ identifier: identifier }) as unknown as Letter;
    }




}