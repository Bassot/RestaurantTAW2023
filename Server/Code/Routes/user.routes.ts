import * as user from "../Models/User";
import express from "express";

export const userRouter = express.Router();


/*
userRouter.use(function (req: any, res) {
    if (!req.auth.isadmin) return res.sendStatus(401);
    res.sendStatus(200);
});
 */
userRouter.get("/", async (req, res) => {
    try {
        let users = await user.getModel().find({});
        res.status(200).send(JSON.stringify(users));
        }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

userRouter.get("/:id", async (req, res) => {
    try {
        const username = req?.params?.id;
        let usertoupdate = await user.getModel().findOne({username: username});

        if (usertoupdate) {
            res.status(200).send(usertoupdate);
        } else {
            res.status(404).send(`Failed to find the user: ${username}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find the user: ${req?.params?.id}`);
    }
});

userRouter.put("/:username", async (req, res) => {
    const username = req?.params?.username;
    const updateduser = req.body;
    try {
        let users = await user.getModel().findOneAndUpdate({username: username}, {$set: updateduser});
        res.status(200).send(JSON.stringify(users));
    }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

userRouter.delete("/:username", async (req, res) => {
    const username = req?.params?.username;
    try {
        let users = await user.getModel().deleteOne({username: username});
        res.status(200).send(JSON.stringify(users));
    }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

