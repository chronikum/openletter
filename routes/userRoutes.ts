import express from "express";
import passport from 'passport'
import UserManager from "../managers/UserManager";
import { checkAuthentication } from "../middleware/AuthenticationMiddleware";

const userRoutes = express.Router();

/**
 * Login to the system and receive a authentication cookie
 */
userRoutes.post('/login', passport.authenticate(['local']), async (req, res) => {
    res.send({ success: true });
});

/**
 * Creates a new user provided
 */
userRoutes.post('/createUser', checkAuthentication, async (req, res) => {
    const user = req.body?.user;
    if (user) {
        await UserManager.instance.createUser(user);
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
});

/**
 * Creates a new user provided
 */
userRoutes.post('/createUser', checkAuthentication, async (req, res) => {
    const user = req.body?.user;
    if (user) {
        await UserManager.instance.createUser(user);
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
});



export default userRoutes;