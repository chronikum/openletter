import mongoose, { Connection, Mongoose } from "mongoose";
import { Observable } from "rxjs";

/**
 * Handles database connections
 */
export default class DatabaseManager {

    static instance = DatabaseManager.getInstance();

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }

        return DatabaseManager.instance;
    }

    // Path to database
    private path: string;

    connection: any;

    // Ready indicator
    isReady: boolean = false;

    /**
     * Prepare mongodb connection
     */
    prepare() {
        this.loadPathForDatabase();
    }


    private loadPathForDatabase() {
        const fallbackPath = 'mongodb://localhost:27017/openletter_database';
        this.path = fallbackPath;
        const readPath = process.env.DATABASE_PATH;
        if (readPath) {
            this.path = readPath;
        }
    }

    /**
     * Keeps you updated about the state of the database
     */
    databaseReady = new Observable((subscriber) => {
        // Try to connect and catch when fail
        mongoose.connect(DatabaseManager.instance.path, { useNewUrlParser: true, useUnifiedTopology: true }).catch(
            // eslint-disable-next-line no-return-assign
            (error) => this.isReady = false,
        );

        mongoose.connection.on('connected', () => {
            console.log("Database connected!")
            this.isReady = true
            subscriber.next(true);
        });

        mongoose.connection.on('error', () => {
            console.log("Connection failed")
            this.isReady = false
            subscriber.next(false);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("Connection failed")
            this.isReady = false
            subscriber.next(false);
        });
    });
}