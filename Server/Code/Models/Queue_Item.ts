import mongoose = require('mongoose');
export interface Queue_Item extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    name: string,
    type: "Dish" | "Drink",
    price: number,
    timestamp: Date,    //to order te queue
    status: "Pending" | "Preparing" | "Ready",
    table: number

}

var QueueItemSchema = new mongoose.Schema<Queue_Item>( {
    name: {
        // the name in this case it is not unique
        type: mongoose.SchemaTypes.String,
        required: true
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    timestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    status: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    table: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
});






export function getSchema() { return QueueItemSchema; }


// Mongoose Model
var queueItemModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< Queue_Item >  { // Return Model as singleton
    if( !queueItemModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        queueItemModel = mongoose.model('queue_item', getSchema());
    }
    return queueItemModel;
}

export function newItem( data: any ): Queue_Item {
    var _queueitemmodel = getModel();
    return new _queueitemmodel(data);
}
