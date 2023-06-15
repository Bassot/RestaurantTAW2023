import mongoose = require('mongoose');
import {Item} from "./Item";
export interface Order extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    table: mongoose.Schema.Types.ObjectId,
    items: [{ item: mongoose.Schema.Types.ObjectId}],
    price: number
}

var orderSchema = new mongoose.Schema<Order>( {
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    items: [
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        }
    ],
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
})

export function getSchema() { return orderSchema; }

// Mongoose Model
var orderModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< Order >  { // Return Model as singleton
    if( !orderModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        orderModel = mongoose.model('Order', getSchema() )
    }
    return orderModel;
}

export function newOrder( data: any ): Order {
    var _ordermodel = getModel();
    return new _ordermodel(data);
}
