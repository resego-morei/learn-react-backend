import { Router } from "express";
import { signIN, signUP } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUP);

authRouter.post('/sign-in', signIN);

authRouter.post('/sign-out', (req, res) => {
    res.send({
        title: 'Sign out'
    });
});

export default authRouter;