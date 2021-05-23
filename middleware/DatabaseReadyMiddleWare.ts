import DatabaseManager from "../managers/DatabaseManager"

/**
 * Middleware which checks if database is ready
 */
export const databaseReadyMiddleware = function (req, res, next) {
    if (DatabaseManager.instance.isReady) {
        next()
    } else {
        res.send({ success: false, message: "Database is not connected." })
    }
}