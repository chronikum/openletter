export default interface Signer {
    identifier: number,
    name?: string,
    organization?: string,
    email: string,
    verified: boolean,
    signing: number, // The letter currently signed by the user
}