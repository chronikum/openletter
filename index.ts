import bodyParser from "body-parser"
import express from "express"
import DatabaseManager from "./managers/DatabaseManager"
import { databaseReadyMiddleware } from "./middleware/DatabaseReadyMiddleWare"
import basicRoutes from "./routes/basicRoutes"
import letterRoutes from './routes/letterRoutes'
import signRoutes from "./routes/signRoutes"

export default class Server {

    // Express App
    app = express()

    // Port
    port = 3000

    // DatabaseManager
    databaseManager = DatabaseManager.instance;

    /**
     * Constructs a new instance of open letter backend
     */
    constructor() {
        this.connectDatabase();
        this.app.use(express.json());
        this.initializeRoutes();
        this.app.listen(this.port);
        console.log(`App listening on ${this.port}`)
    }


    /**
     * Load and set routes
     */
    initializeRoutes() {
        this.app.use('/', databaseReadyMiddleware, basicRoutes);
        this.app.use('/letter', databaseReadyMiddleware, letterRoutes);
        this.app.use('/signer', databaseReadyMiddleware, signRoutes);
    }

    /**
     * Connects to database and wait until its ready
     */
    connectDatabase() {
        this.databaseManager.prepare();
        this.databaseManager.databaseReady.subscribe(ready => {
            if (ready) {
                console.log("Database is ready!")
            } else {
                console.log("Database is not available yet")
            }
        })
    }

}


let server = new Server();