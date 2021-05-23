import bodyParser from "body-parser"
import express from "express"
import DatabaseManager from "./managers/DatabaseManager"
import { databaseReadyMiddleware } from "./middleware/DatabaseReadyMiddleWare"
import StartManager from "./middleware/StartManager"
import basicRoutes from "./routes/basicRoutes"
import letterRoutes from './routes/letterRoutes'
import signRoutes from "./routes/signRoutes"
import userRoutes from "./routes/userRoutes"

export default class Server {

    // Express App
    app = express()

    // Port
    port = 3000

    // DatabaseManager
    databaseManager = DatabaseManager.instance;

    // First Start Manager
    startManager = StartManager.instance

    /**
     * Constructs a new instance of open letter backend
     */
    constructor() {
        this.connectDatabase();
        this.app.use(express.json());
        this.initializeRoutes();
        this.app.listen(this.port);
        this.app.use((err, req, res, next) => {
            res.status(500);
            res.send({ success: false, message: 'Sorry, we ran into an critically error.' });
        });
        console.log(`App listening on ${this.port}`)
    }


    /**
     * Load and set routes
     */
    initializeRoutes() {
        this.app.use('/', databaseReadyMiddleware, basicRoutes);
        this.app.use('/letter', databaseReadyMiddleware, letterRoutes);
        this.app.use('/signer', databaseReadyMiddleware, signRoutes);
        this.app.use('/user', databaseReadyMiddleware, userRoutes);
    }

    /**
     * Connects to database and wait until its ready
     */
    connectDatabase() {
        this.databaseManager.prepare();
        this.databaseManager.databaseReady.subscribe(ready => {
            if (ready) {
                console.log("Database is ready!")
                this.initialSetup();
            } else {
                console.log("Database is not available yet")
            }
        })
    }

    /**
     * Running initial setup
     * - will be called when database is ready
     */
    initialSetup() {
        this.startManager.isFirstStart();
    }

}


let server = new Server();