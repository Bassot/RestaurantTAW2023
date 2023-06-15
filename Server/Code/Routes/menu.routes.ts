import * as item from "../Models/Item";
import {expressjwt as jwt} from "express-jwt";
const dotenv = require('dotenv').config();
const express = require('express');

/*
if (dotenv.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key".red);
    process.exit(-1);
} else if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found".red);
    process.exit(-1);
}

/*
userRouter.use(function (req: any, res) {
    if (!req.auth.isadmin) return res.sendStatus(401);
    res.sendStatus(200);
});
 */
export const menuRouter = express.Router();
//tablesRouter.use(express.json());
menuRouter.get("/", async (req, res) => {
    try {
        let items = await item.getModel().find({});
        res.status(200).send(JSON.stringify(items));
    }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

