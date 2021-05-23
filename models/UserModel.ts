import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */
const userSchema = new Schema({
    userId: String,
    username: String,
    email: String,
    password: String,
});

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
