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
exports.menuRouter = void 0;
const item = __importStar(require("../Models/Item"));
const express = require('express');
exports.menuRouter = express.Router();
//tablesRouter.use(express.json());
exports.menuRouter.get("/", (req, res) => {
    item.getModel().find({}).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        res.status(500).send('DB error: ' + err);
    });
});
exports.menuRouter.delete("/:name", (req, res) => {
    if (req.params.name == undefined)
        return res.status(500).json({ error: true, errormessage: 'Given params are not correct' });
    item.getModel().find({}).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        res.status(500).send('DB error: ' + err);
    });
});
exports.menuRouter.post("/", (req, res) => {
    if (req.body.name == undefined || req.body.price == undefined || (req.body.type != 'Dish' && req.body.type != 'Drink')) {
        return res.status(500).json({ error: true, errormessage: 'Given params are not correct' });
    }
    const i = {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price
    };
    item.newItem(i).save().then((item) => {
        return res.status(200).json(item);
    }).catch((err) => {
        return res.status(500).send('DB error: ' + err);
    });
});
