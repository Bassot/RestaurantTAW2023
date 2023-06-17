import mongoose = require('mongoose');
import * as queueItem from "./Queue_Item";
export interface Receipt extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    table: number,
    items: queueItem.Queue_Item[],
    total: number,
    waiter: string,
    timestamp: Date
}

var ReceiptSchema = new mongoose.Schema<Receipt>( {
    table: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    items: {
        type: [queueItem.getSchema()],
        required: true
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    waiter: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    timestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    }
})


export function getSchema() { return ReceiptSchema; }



// Mongoose Model
var receiptModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< Receipt >  { // Return Model as singleton
    if( !receiptModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        receiptModel = mongoose.model('Receipt', getSchema() )
    }
    return receiptModel;
}

export function newReceipt(data: any ): Receipt {
    var _receiptmodel = getModel();
    return new _receiptmodel(data);
}
