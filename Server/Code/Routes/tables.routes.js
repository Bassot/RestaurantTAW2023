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
const user = __importStar(require("../Models/User"));
const express = require('express');
const index_1 = require("../index");
exports.tablesRouter = express.Router();
//tablesRouter.use(express.json());
exports.tablesRouter.get("/", (req, res) => {
    if (req.query.email == undefined) {
        table.getModel().find({}).sort({ number: 1 }).then((tables) => {
            res.status(200).json(tables);
        }).catch((err) => {
            res.status(500).send('DB error: ' + err);
        });
    }
    else {
        user.getModel().findOne({ email: req.query.email }).then((user) => {
            if (user) {
                table.getModel().find({
                    $or: [
                        { waiter: user._id },
                        { isFree: true }
                    ]
                }).sort({ number: 1 }).then((tables) => {
                    res.status(200).json(tables);
                });
            }
        }).catch((err) => {
            res.status(500).send('DB error: ' + err);
        });
    }
});
exports.tablesRouter.post("/", (req, res) => {
    if (req.body.number == undefined || req.body.seats == undefined)
        return res.status(500).json({ error: true, errormessage: "Given Params are not correct" });
    let t = {
        number: req.body.number,
        seats: req.body.seats,
        isFree: true,
        bill: 0
    };
    table.newTable(t).save().then((table) => {
        notify();
        return res.status(200).json({ error: false, errormessage: "", id: table._id });
    }).catch((err) => {
        return res.status(500).json({ error: true, errormessage: "DB error: " + err });
    });
});
exports.tablesRouter.delete('/:tableid', (req, res) => {
    table.getModel().deleteOne({ table: req.params.tableid }).then((table) => {
        if (table.deletedCount > 0) {
            notify();
            return res.status(200).json({ error: false, errormessage: "" });
        }
        else
            return res.status(404).json({ error: true, errormessage: "Invalid table id" });
    }).catch((err) => {
        return res.status(404).json({ error: true, errormessage: "Mongo error: " + err });
    });
    console.log('DELETE request for items related to table: ' + req.params.tableid);
});
exports.tablesRouter.put("/:number", (req, res) => {
    user.getModel().findOne({ email: req.query.email }).then((user) => {
        if (user != null) {
            console.log(user._id);
            const filter = {
                number: req.params.number
            };
            let update = {};
            console.log(req.query.action);
            if (req.query.action == 'occupy')
                update = {
                    isFree: false,
                    waiter: user._id
                };
            else if (req.query.action == 'free')
                update = {
                    isFree: true,
                    waiter: null
                };
            table.getModel().findOneAndUpdate(filter, update, { new: true }).then((table) => {
                notify();
                return res.status(200).send("Ok, table occupied: " + table);
            }).catch((err) => {
                return res.status(500).send('DB error: ' + err);
            });
        }
        else {
            console.log("sticazzi");
        }
    });
});
function notify() {
    let m = 'Hello';
    index_1.ios.emit('tables', m);
}
