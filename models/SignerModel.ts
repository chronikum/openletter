import mongoose, { Schema } from 'mongoose';

const signerSchema = new Schema({
    identifier: Number,
    name: String,
    organization: String,
    email: String,
    verified: Boolean,
    signing: Number,
});

export const SignerModel = mongoose.model('Signer', signerSchema);