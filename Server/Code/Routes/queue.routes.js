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
exports.queueRouter = void 0;
const queue_item = __importStar(require("../Models/Queue_Item"));
const colors = require("colors");
const index_1 = require("../index");
colors.enabled = true;
const express = require('express');
exports.queueRouter = express.Router();
/**
 * path = localhost:8080/queue/
 */
// posting an array of items in the queue
// on req.body there is something like: [{nameItem1, ... }, {nameItem2, ... }]
exports.queueRouter.post('/', (req, res) => {
    console.log('Adding new items on the queue, received : ' + JSON.stringify(req.body));
    let receivedItems = req.body;
    receivedItems.forEach(function (item) {
        item.timestamp = new Date();
    });
    queue_item.getModel().insertMany(receivedItems).then((item) => {
        notify();
        return res.status(200).json({ error: false, errormessage: "", id: 0 });
    }).catch((err) => {
        return res.status(404).json({ error: true, errormessage: "Mongo error: " + err });
    });
});
exports.queueRouter.get('/:type', (req, res) => {
    console.log('GET request for queue items, param: ' + req.params.type);
    let filter = {};
    if (req.params.type == 'dish')
        filter = { type: 'Dish' };
    else if (req.params.type == 'drink')
        filter = { type: 'Drink' };
    // else -> getting all the queue
    queue_item.getModel().find(filter).sort({ timestamp: 1, table: 1 }).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        return res.status(404).send('DB error: ' + err);
    });
});
// getting all the items related to a table
exports.queueRouter.get('/table/:tableid', (req, res) => {
    queue_item.getModel().find({ table: req.params.tableid }).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        return res.status(404).send('DB error: ' + err);
    });
    console.log('DELETE request for items related to table: ' + req.params.tableid);
});
// deleting all the items related to a table
exports.queueRouter.delete('/table/:tableid', (req, res) => {
    queue_item.getModel().deleteMany({ table: req.params.tableid }).then((items) => {
        if (items.deletedCount > 0) {
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
// updating the order
exports.queueRouter.put('/update', (req, res) => {
    console.log('Updating request for item: ' + JSON.stringify(req.body));
    if (req.body.id == undefined || req.body.status == undefined)
        return res.status(404).json({ error: true, errormessage: "Invalid params" });
    const filter = { _id: req.body.id };
    const update = { status: req.body.status };
    queue_item.getModel().findOneAndUpdate(filter, update, { new: true }).then((item) => {
        console.log('Item updated');
        notify();
        return res.status(200).json(item);
    }).catch((err) => {
        console.log(('Error updating item: ' + err).red);
        return res.status(404).json({ error: true, errormessage: "Invalid id item" });
    });
});
function notify() {
    let m = 'Hello';
    index_1.ios.emit('queue', m);
}
