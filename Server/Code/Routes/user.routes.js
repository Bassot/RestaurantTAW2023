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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user = __importStar(require("../Models/User"));
const express_1 = __importDefault(require("express"));
exports.userRouter = express_1.default.Router();
/*
userRouter.use(function (req: any, res) {
    if (!req.auth.isadmin) return res.sendStatus(401);
    res.sendStatus(200);
});
 */
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield user.getModel().find({});
        res.status(200).send(JSON.stringify(users));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const username = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        let usertoupdate = yield user.getModel().findOne({ username: username });
        if (usertoupdate) {
            res.status(200).send(usertoupdate);
        }
        else {
            res.status(404).send(`Failed to find the user: ${username}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find the user: ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id}`);
    }
}));
exports.userRouter.put("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const username = (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.username;
    const updateduser = req.body;
    try {
        let users = yield user.getModel().findOneAndUpdate({ username: username }, { $set: updateduser });
        res.status(200).send(JSON.stringify(users));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.userRouter.delete("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const username = (_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.username;
    try {
        let users = yield user.getModel().deleteOne({ username: username });
        res.status(200).send(JSON.stringify(users));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
