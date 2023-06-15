import * as user from "../Models/User";
const express = require('express');

export const userRouter = express.Router();
//TODO: updating responses
userRouter.get("/", (req, res) => {
    user.getModel().find({}).then((users) => {
        res.status(200).json(users);
    }).catch((err) => {
        res.status(500).send('Error getting user: ' + err);
    });
});
/*
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

 */
userRouter.put("/:email", async (req, res) => {
    const email = req?.params?.email;
    const updateduser = req.body;
    try {
        let users = await user.getModel().findOneAndUpdate({email: email}, {$set: updateduser});
        res.status(200).send(JSON.stringify(users));
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

userRouter.delete("/:email", (req, res) => {
    const email = req?.params?.email;
    user.getModel().deleteOne({email: email}).then((user) => {
        res.status(200).json(user);
    }).catch((err) => {
        res.status(500).json({error: true, errormessage: "Invalid email, err: " + err});
    });

});

