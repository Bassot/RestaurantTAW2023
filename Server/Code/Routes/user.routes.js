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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user = __importStar(require("../Models/User"));
const express = require('express');
exports.userRouter = express.Router();
//TODO: updating responses
exports.userRouter.get("/", (req, res) => {
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
exports.userRouter.put("/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.email;
    const updateduser = req.body;
    try {
        let users = yield user.getModel().findOneAndUpdate({ email: email }, { $set: updateduser });
        res.status(200).send(JSON.stringify(users));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.userRouter.delete("/:email", (req, res) => {
    var _a;
    const email = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.email;
    user.getModel().deleteOne({ email: email }).then((user) => {
        res.status(200).json(user);
    }).catch((err) => {
        res.status(500).json({ error: true, errormessage: "Invalid email, err: " + err });
    });
});
