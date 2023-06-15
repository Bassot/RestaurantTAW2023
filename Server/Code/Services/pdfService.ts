import {Queue_Item} from "../Models/Queue_Item";
import {Receipt} from "../Models/Receipt";

const PDFDocument = require('pdfkit');

export function makeReceiptPDF(tableNum, date, items: Queue_Item[], total){
    const doc = new PDFDocument({font: 'Courier'});
    doc.fontSize(20).text('RECEIPT table ' + tableNum, { align: 'center'});
    doc.fontSize(12).text('Date: ' + date);
    doc.fontSize(20).text('--------------------------------------', { align: 'justify'});
    items.forEach((item) => {
        doc.fontSize(12);
        doc.text(' ' + item.name);
        doc.moveUp();
        doc.text('€ ' + item.price + '  ', { align: 'right'});

    })
    doc.fontSize(20).text('--------------------------------------', { align: 'justify'});
    doc.fontSize(15).text('TOTAL:');
    doc.moveUp();
    doc.text('€ ' + total + '  ', { align: 'right' });
    doc.end();
    return doc;
}

export function makeProfitPDF(day1, day2, recs: Receipt[], date, total){
    const doc = new PDFDocument({font: 'Courier'});
    doc.fontSize(20).text('RECEIPTS FROM:', {align: 'center'});
    doc.fontSize(20).text(' ' + day1, {align: 'center'});
    doc.fontSize(20).text('TO:', {align: 'center'});
    doc.fontSize(20).text(' ' + day2, {align: 'center'});
    doc.fontSize(20).text('--------------------------------------', { align: 'justify'});
    recs.forEach((rec) => {
        doc.fontSize(10);
        doc.text('Table: '+rec.table+', total: '+rec.total+', date: '+rec.timestamp);
        rec.items.forEach((item)=>{
            doc.fontSize(8);
            doc.text(' ' + item.name);
            doc.moveUp();
            doc.text('€ ' + item.price + '  ', { align: 'right'});
        });
        doc.fontSize(8).text('-------------------------------------------', { align: 'justify'})
    })
    doc.fontSize(20).text('--------------------------------------', { align: 'justify'});
    doc.fontSize(15).text('TOTAL:');
    doc.moveUp();
    doc.text('€ ' + total + '  ', { align: 'right' });
    doc.fontSize(12).text('Date: ' + date);
    doc.end();
    return doc;
}