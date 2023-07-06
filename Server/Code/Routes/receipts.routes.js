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
exports.receiptRouter = void 0;
const receipt = __importStar(require("../Models/Receipt"));
const pdfService_1 = require("../Services/pdfService");
const express = require('express');
exports.receiptRouter = express.Router();
exports.receiptRouter.post('/', (req, res) => {
    if (req.auth.role != 'Cashier')
        return res.status(401).json({ error: "You are not an admin" });
    if (req.body.table == undefined || req.body.waiter == undefined)
        return res.status(400).json({ error: "Given Params are not correct" });
    let r = req.body;
    r.timestamp = new Date();
    receipt.newReceipt(r).save().then((receipt) => {
        return res.status(200).json({ error: false, errormessage: "", id: receipt._id });
    }).catch((err) => {
        return res.status(500).json({ error: true, errormessage: "DB error: " + err.errmsg });
    });
});
exports.receiptRouter.post('/profit', (req, res) => {
    if (req.auth.role != 'Cashier')
        return res.status(401).json({ error: "You are not an admin" });
    if (req.body.start == undefined || req.body.end == undefined)
        return res.status(400).json({ error: "Given Params are not correct" });
    let start = req.body.start;
    let end = req.body.end;
    receipt.getModel().find({
        timestamp: { $gte: start, $lte: end }
    }).then((receipts) => {
        return res.status(200).json(receipts);
    }).catch((err) => {
        return res.status(500).json({ error: "DB error: " + err });
    });
});
exports.receiptRouter.post('/receiptPDF', (req, res) => {
    if (req.auth.role != 'Cashier')
        return res.status(401).json({ error: "You are not an admin" });
    console.log('Creating receipt PDF for table: ' + req.body.tableNum);
    (0, pdfService_1.makeReceiptPDF)(req.body.tableNum, new Date(), req.body.items, req.body.total).pipe(res);
});
exports.receiptRouter.post('/profitPDF', (req, res) => {
    if (req.auth.role != 'Cashier')
        return res.status(401).json({ error: "You are not an admin" });
    console.log('Creating profit PDF between : ' + req.body.start + ' and ' + req.body.end);
    (0, pdfService_1.makeProfitPDF)(req.body.start, req.body.end, req.body.receipts, new Date(), req.body.total, req.body.itStatistics, req.body.waitStatistics).pipe(res);
});
