import mongoose = require('mongoose');
import crypto = require('crypto');

export interface User extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    username: string,
    email: string,
    role:  "Waiter" | "Cook" | "Bartender" | "Cashier";
    salt: string,    // salt is a random string that will be mixed with the actual password before hashing
    digest: string,  // this is the hashed password (digest of the password)
    setPassword: (pwd:string)=>void,
    validatePassword: (pwd:string)=>boolean,
    isAdmin: ()=>boolean
}

var userSchema = new mongoose.Schema<User>( {
    username: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    role:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },
    salt:  {
        type: mongoose.SchemaTypes.String,
        required: false 
    },
    digest:  {
        type: mongoose.SchemaTypes.String,
        required: false 
    }
})

// Here we add some methods to the user Schema

userSchema.methods.setPassword = function( pwd:string ) {

    this.salt = crypto.randomBytes(16).toString('hex'); // We use a random 16-bytes hex string for salt

    // We use the hash function sha512 to hash both the password and salt to
    // obtain a password digest 
    // 
    // From wikipedia: (https://en.wikipedia.org/wiki/HMAC)
    // In cryptography, an HMAC (sometimes disabbreviated as either keyed-hash message 
    // authentication code or hash-based message authentication code) is a specific type 
    // of message authentication code (MAC) involving a cryptographic hash function and 
    // a secret cryptographic key.
    //
    var hmac = crypto.createHmac('sha512', this.salt );
    hmac.update( pwd );
    this.digest = hmac.digest('hex'); // The final digest depends both by the password and the salt
}

userSchema.methods.validatePassword = function( pwd:string ):boolean {

    // To validate the password, we compute the digest with the
    // same HMAC to check if it matches with the digest we stored
    // in the database.
    //
    var hmac = crypto.createHmac('sha512', this.salt );
    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
}

userSchema.methods.isAdmin = function (): boolean {
    return this.role === 'Cashier';
}
export function getSchema() { return userSchema; }


// Mongoose Model
var userModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< User >  { // Return Model as singleton
    if( !userModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        userModel = mongoose.model('User', getSchema() )
    }
    return userModel;
}

export function newUser( data ): User {
    var _usermodel = getModel();
    return new _usermodel(data);
}
