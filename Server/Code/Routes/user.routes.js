"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user = __importStar(require("../Models/User"));
const express = require('express');
exports.userRouter = express.Router();
exports.userRouter.get("/", (req, res) => {
    user.getModel().find({}).then((users) => {
        return res.status(200).json(users);
    }).catch((err) => {
        return res.status(404).json({ error: 'Error getting user: ' + err });
    });
});
exports.userRouter.post("/", (req, res) => {
    if (req.body.email == undefined || req.body.password == undefined || req.body.username == undefined ||
        (req.body.role != 'Cashier' && req.body.role != 'Waiter' && req.body.role != 'Cook' && req.body.role != 'Bartender'))
        return res.status(400).json({ error: "Params given are not correct" });
    let u = user.newUser(req.body);
    u.setPassword(req.body.password);
    u.save().then((data) => {
        return res.status(200).json({ message: 'User created: ' + data });
    }).catch((reason) => {
        if (reason.code === 11000)
            return res.status(400).json({ error: "User already exists" });
        return res.status(404).json({ error: "DB error: " + reason });
    });
});
exports.userRouter.delete("/:email", (req, res) => {
    var _a;
    const email = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.email;
    user.getModel().deleteOne({ email: email }).then((user) => {
        return res.status(200).json(user);
    }).catch((err) => {
        return res.status(404).json({ error: "Invalid email, err: " + err });
    });
});
