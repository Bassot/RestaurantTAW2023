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
exports.tablesRouter = void 0;
const table = __importStar(require("../Models/Table"));
const express = require('express');
const index_1 = require("../index");
exports.tablesRouter = express.Router();
//tablesRouter.use(express.json());
exports.tablesRouter.get("/", (req, res) => {
    table.getModel().find({}).sort({ number: 1 }).then((tables) => {
        return res.status(200).json(tables);
    }).catch((err) => {
        return res.status(404).json({ error: 'Error getting tables: ' + err });
    });
});
exports.tablesRouter.post("/", (req, res) => {
    if (req.body.number == undefined || req.body.seats == undefined || !req.body.isFree || req.body.bill != 0)
        return res.status(400).json({ error: "Given Params are not correct" });
    table.newTable(req.body).save().then((table) => {
        notify();
        return res.status(200).json({ error: "", id: table._id });
    }).catch((err) => {
        return res.status(400).json({ error: "Given Params are not correct" });
    });
});
exports.tablesRouter.delete('/:tableid', (req, res) => {
    if (req.params.tableid == undefined)
        return res.status(404).json({ error: "Invalid table id" });
    table.getModel().deleteOne({ number: req.params.tableid }).then((table) => {
        if (table.deletedCount > 0) {
            notify();
            return res.status(200).json({ message: 'User deleted' });
        }
        else
            return res.status(404).json({ error: "Invalid table id" });
    }).catch((err) => {
        return res.status(404).json({ error: "Mongo error: " + err });
    });
    console.log('DELETE request for items related to table: ' + req.params.tableid);
});
exports.tablesRouter.put("/:number", (req, res) => {
    const filter = {
        number: req.params.number
    };
    let update = {};
    if (req.query.action == 'occupy')
        update = {
            isFree: false,
            waiter: req.query.email
        };
    else if (req.query.action == 'free')
        update = {
            isFree: true,
            waiter: null
        };
    table.getModel().findOneAndUpdate(filter, update, { new: true }).then((table) => {
        notify();
        return res.status(200).json({ message: "Ok, table " + table + " status updated" });
    }).catch((err) => {
        return res.status(404).json({ error: "Table not found: " + err });
    });
});
function notify() {
    let m = 'Hello';
    index_1.ios.emit('tables', m);
}
