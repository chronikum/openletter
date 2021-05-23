import { Connection, Mongoose } from "mongoose";
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

    // Mongoose Stuff
    mongoose = new Mongoose();
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
        this.mongoose.connect(DatabaseManager.instance.path, { useNewUrlParser: true, useUnifiedTopology: true }).catch(
            // eslint-disable-next-line no-return-assign
            (error) => this.isReady = false,
        );

        this.mongoose.connection.on('connected', () => {
            console.log("Databas connected!")
            this.isReady = true
            subscriber.next(true);
        });

        this.mongoose.connection.on('error', () => {
            console.log("Connection failed")
            this.isReady = false
            subscriber.next(false);
        });

        this.mongoose.connection.on('disconnected', () => {
            console.log("Connection failed")
            this.isReady = false
            subscriber.next(false);
        });
    });
}