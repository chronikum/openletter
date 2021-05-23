import UserManager from "../managers/UserManager";
import SystemlogModel from "../models/SystemlogModel";

/**
 * Determines if the current start is the first start
 */
export default class StartManager {
    static instance = StartManager.getInstance();

    public static getInstance(): StartManager {
        if (!StartManager.instance) {
            StartManager.instance = new StartManager();
        }

        return StartManager.instance;
    }

    /**
     * Determines if first start
     * - creates the admin user if it is the first start
     */
    async isFirstStart(): Promise<boolean> {
        const hasStarted = await SystemlogModel.findOne({ initialStart: true });
        if (hasStarted) {
            console.log("This is not the first start")
            return Promise.resolve(false)
        } else {
            console.log("This is the first start")
            this.setFirstStart();
            await UserManager.instance.createUser({
                username: 'admin',
                email: process.env.ADMINEMAIL || 'example.com'
            })
            console.log("Admin user created")
            return Promise.resolve(true)
        }
    }

    /**
     * Initial Setup
     */
    async setFirstStart() {
        const now = Date.now();
        const initalMessage = new SystemlogModel({
            message: "First start",
            date: now,
            initialStart: true
        })
        await initalMessage.save()
    }

}