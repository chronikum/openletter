/**
 * Information about signees of a letter
 */
export default interface SigneeInformation {
    letterIdentifier: number,
    signeeCount: number,
    names: string[],
}