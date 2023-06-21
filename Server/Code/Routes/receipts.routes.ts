import * as receipt from '../Models/Receipt'
import {makeProfitPDF, makeReceiptPDF} from "../Services/pdfService";

const express = require('express');

export const receiptRouter = express.Router();

receiptRouter.post('/', (req, res) => {
    if(req.body.table == undefined || req.body.waiter == undefined)
        return res.status(400).json({error: "Given Params are not correct"});
    let r = req.body;
    r.timestamp = new Date();
    receipt.newReceipt(r).save().then((receipt) => {
        return res.status(200).json({error: false, errormessage: "", id: receipt._id});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: "DB error: " + err.errmsg});
    })
});

receiptRouter.post('/profit', (req, res) => {
    if(req.body.start == undefined || req.body.end == undefined)
        return res.status(400).json({error: "Given Params are not correct"});
    let start = req.body.start;
    let end = req.body.end;
    receipt.getModel().find({
        timestamp: {$gte: start, $lte: end}
    }).then((receipts) => {
        return res.status(200).json(receipts);
    }).catch((err) => {
        return res.status(500).json({error: "DB error: " + err});
    });
});

receiptRouter.post('/receiptPDF', (req, res) => {
    console.log('Creating receipt PDF for table: ' + req.body.tableNum);
    makeReceiptPDF(req.body.tableNum, new Date(), req.body.items, req.body.total).pipe(res);
});
receiptRouter.post('/profitPDF', (req, res) => {
    console.log('Creating profit PDF between : ' + req.body.start + ' and ' + req.body.end);
    makeProfitPDF(req.body.start,
        req.body.end,
        req.body.receipts,
        new Date(),
        req.body.total,
        req.body.itStatistics,
        req.body.waitStatistics).pipe(res);
});
