/**
 * A interface representing a letter
 */
export default interface Letter {
    identifier?: number,
    title: string,
    description: string,
    signers: string[],
}