import crypto from 'crypto'
import { User } from "../interfaces/User";
import UserModel from "../models/UserModel";

export default class UserManager {
    static instance = UserManager.getInstance();

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }

        return UserManager.instance;
    }


    /**
     * Creates new user
     */
    async createUser(user: User) {
        if (user.email && user.username) {
            const userId = await UserModel.count() || 0;
            user.userId = (userId + 1);

            const adminPassword = crypto.randomBytes(4).toString('hex');
            console.log(`Passwort for initial admin user ${adminPassword}`)
            const hashedPW = crypto.createHmac('sha256', adminPassword).digest('hex');
            user.password = hashedPW
            const userModel = new UserModel(user);
            await userModel.save();
        }
    }
}