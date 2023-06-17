"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeProfitPDF = exports.makeReceiptPDF = void 0;
const PDFDocument = require('pdfkit');
function makeReceiptPDF(tableNum, date, items, total) {
    const doc = new PDFDocument({ font: 'Courier' });
    doc.fontSize(20).text('RECEIPT table ' + tableNum, { align: 'center' });
    doc.fontSize(12).text('Date: ' + date);
    doc.fontSize(20).text('--------------------------------------', { align: 'justify' });
    items.forEach((item) => {
        doc.fontSize(12);
        doc.text(' ' + item.name);
        doc.moveUp();
        doc.text('€ ' + item.price + '  ', { align: 'right' });
    });
    doc.fontSize(20).text('--------------------------------------', { align: 'justify' });
    doc.fontSize(15).text('TOTAL:');
    doc.moveUp();
    doc.text('€ ' + total + '  ', { align: 'right' });
    doc.end();
    return doc;
}
exports.makeReceiptPDF = makeReceiptPDF;
function makeProfitPDF(day1, day2, recs, date, total, itStat, waitStat) {
    const doc = new PDFDocument({ font: 'Courier' });
    doc.fontSize(20).text('RECEIPTS FROM:', { align: 'center' });
    doc.fontSize(20).text(' ' + day1, { align: 'center' });
    doc.fontSize(20).text('TO:', { align: 'center' });
    doc.fontSize(20).text(' ' + day2, { align: 'center' });
    doc.fontSize(20).text('--------------------------------------', { align: 'justify' });
    recs.forEach((rec) => {
        doc.fontSize(10);
        doc.text('Table: ' + rec.table + ', total: ' + rec.total + ', date: ' + rec.timestamp);
        rec.items.forEach((item) => {
            doc.fontSize(8);
            doc.text(' ' + item.name);
            doc.moveUp();
            doc.text('€ ' + item.price + '  ', { align: 'right' });
        });
        doc.fontSize(8).text('-------------------------------------------', { align: 'justify' });
    });
    doc.fontSize(20).text('--------------------------------------', { align: 'justify' });
    doc.fontSize(15).text('TOTAL:');
    doc.moveUp();
    doc.text('€ ' + total + '  ', { align: 'right' });
    doc.fontSize(20).text('--------------------------------------', { align: 'justify' });
    doc.fontSize(20).text('--------------------------------------', { align: 'justify' });
    doc.fontSize(12);
    doc.text('ITEMS STATISTICS (number of sales): ');
    itStat.forEach((it) => {
        doc.text(it.name + ' :');
        doc.moveUp();
        doc.text(+it.num, { align: 'right' });
    });
    doc.moveDown();
    doc.text('WAITER STATISTICS (number of items served): ');
    waitStat.forEach((waitr) => {
        doc.text(waitr.email + ' :');
        doc.moveUp();
        doc.text(waitr.num, { align: 'right' });
    });
    doc.moveDown();
    doc.text('Date: ' + date);
    doc.end();
    return doc;
}
exports.makeProfitPDF = makeProfitPDF;
