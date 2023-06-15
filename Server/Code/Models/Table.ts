import mongoose = require('mongoose');

export interface Table extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,

    number: number,
    seats: number,
    //orders: [{ order: mongoose.Schema.Types.ObjectId}],
    isFree: boolean,
    bill: number,

    waiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    occupyTable: ()=>void,
    freeTable: ()=>void
}

var userSchema = new mongoose.Schema<Table>( {
    number: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    seats: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    isFree: {
        type: mongoose.SchemaTypes.Boolean,
        required: true
    },
    /*
    orders: [
        {
            order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        }
    ],

     */
    bill: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    waiter:
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
        }

})

userSchema.methods.occupyTable = function(): void {
    this.isFree = false;
}

userSchema.methods.freeTable = function(): void {
    this.orders = null;
    this.bill = 0;
    this.isTrue = true;
}



export function getSchema() { return userSchema; }



// Mongoose Model
var tableModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< Table >  { // Return Model as singleton
    if( !tableModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        tableModel = mongoose.model('Table', getSchema() )
    }
    return tableModel;
}

export function newTable( data: any ): Table {
    var _tablemodel = getModel();
    return new _tablemodel(data);
}
