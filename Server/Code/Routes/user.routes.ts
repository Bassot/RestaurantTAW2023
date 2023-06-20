import * as user from "../Models/User";
const express = require('express');

export const userRouter = express.Router();
userRouter.get("/", (req, res) => {
    user.getModel().find({}).then((users) => {
        return res.status(200).json(users);
    }).catch((err) => {
        return res.status(404).json({error: 'Error getting user: ' + err});
    });
});
userRouter.post("/", (req, res) => {
    if(req.body.email == undefined || req.body.password == undefined || req.body.username == undefined ||
        (req.body.role != 'Cashier' && req.body.role != 'Waiter' && req.body.role != 'Cook' && req.body.role != 'Bartender'))
        return res.status(400).json({error: "Params given are not correct"});
    let u = user.newUser(req.body);
    u.setPassword(req.body.password);
    u.save().then((data: any) => {
        return res.status(200).json({message: 'User created: '+data});
    }).catch((reason) => {
        if (reason.code === 11000)
            return res.status(400).json({error: "User already exists"});
        return res.status(404).json({error: "DB error: " + reason});
    });
});

userRouter.delete("/:email", (req, res) => {
    const email = req?.params?.email;
    user.getModel().deleteOne({email: email}).then((user) => {
        return res.status(200).json(user);
    }).catch((err) => {
        return res.status(404).json({ error: "Invalid email, err: " + err});
    });
});

