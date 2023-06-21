
const dotenv = require('dotenv').config();
import colors = require('colors');

colors.enabled = true;
if (dotenv.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key".red);
    process.exit(-1);
} else if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found".red);
    process.exit(-1);
}
import * as mongoose from 'mongoose';

const express = require('express');
import * as http from "http";

const cors = require('cors');
const bodyParser = require('body-parser');
const {expressjwt: jwt} = require('express-jwt');
import jsonwebtoken = require('jsonwebtoken');  // JWT generation
const io = require('socket.io');


import * as user from './Models/User';
import * as table from './Models/Table';
import * as item from './Models/Item';

import {tablesRouter} from "./Routes/tables.routes";
import {queueRouter} from "./Routes/queue.routes";
import {userRouter} from "./Routes/user.routes";
import {menuRouter} from "./Routes/menu.routes";
import {receiptRouter} from "./Routes/receipts.routes";

const app = express();
export let ios;
const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("------------------------------------------------".inverse)
    console.log("New request for: " + req.url);
    console.log("Method: " + req.method);
    next();
})
/*
// auth debug
app.use(function (req: any, res) {
    console.log('HEADER auth: ' + req.get('Authorization'));
    console.log('Auth : ' + req.auth);
    console.log('Headers : ' + JSON.stringify(req.headers));
    req.next();
});
 */
app.get('/', function (req, res) {
    res.status(200).json({api_version: '1.1', authors: 'Andrea Basso, Riccardo Nalgi'});
});
app.post('/login', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("New login attempt from ".green + JSON.stringify(email));
    user.getModel().findOne({email: email}).then((user) => {
        if (!user) {
            return res.status(404).json({error: "Invalid user"});
        }
        if (user.validatePassword(password)) {
            let tokendata = {
                email: user.email,
                username: user.username,
                role: user.role,
                id: user.id
            };
            console.log("Login granted. Generating token");
            let token_signed = jsonwebtoken.sign(
                tokendata,
                process.env.JWT_SECRET as jsonwebtoken.Secret,
                {expiresIn: '12h'}
            );

            return res.status(200).json({
                id: user._id,
                token: token_signed
            });
        }
        return res.status(401).json({error:  "Invalid password"});
    });
});

// other routes
app.use("/users", auth, userRouter);
app.use("/tables", auth, tablesRouter);
app.use("/queue", auth, queueRouter);
app.use("/menu", auth, menuRouter);
app.use("/receipts", auth, receiptRouter);

// the ENV var DBHOST is set only if the server is running inside a container
const dbHost = process.env.DBHOST || '127.0.0.1';
mongoose.connect('mongodb://' + dbHost + ':27017/taw-app2023').then(() => {
    let s = 'Connected to mongoDB, dbHost: ' + dbHost;
    console.log(s.bgGreen);
    return user.getModel().findOne({email: "cashier@cashier.it"});
}).then((data) => {
    if (!data) {
        console.log("Creating admin user");
        let u = user.newUser({
            username: "cashier",
            email: "cashier@cashier.it",
            role: "Cashier"
        });
        u.setPassword("cashier");
        u.save();
    } else {
        console.log("Admin user already exists");
    }
    return user.getModel().findOne({username: "Pippo"});
}).then((data) => {
    if (!data) {
        console.log("Creating sample users");
        let w = user.newUser({
            username: "Pippo",
            email: "waiter@waiter.it",
            role: "Waiter"
        });
        w.setPassword("123");
        w.save();
        let c = user.newUser({
            username: "Pluto",
            email: "cook@cook.it",
            role: "Cook"
        });
        c.setPassword("123");
        c.save();
        let b = user.newUser({
            username: "Paperino",
            email: "bartender@bartender.it",
            role: "Bartender"
        });
        b.setPassword("123");
        b.save();
    } else {
        console.log("users already exists");
    }
    return table.getModel().findOne({number: 1});
}).then((data) => {
    if (!data) {
        console.log("Creating 4 tables with 4 seats");
        for (let i = 1; i < 5; i++) {
            let t = table.newTable({
                number: i,
                seats: 4,
                isFree: true,
                bill: 0,
            });
            t.save();
        }
    } else {
        console.log("Tables already exist");
    }
    return item.getModel().findOne({name: "Pizza"});
}).then((data) => {
    if (!data) {
        console.log("Creating some items");
        item.newItem({
            name: "Pizza",
            type: "Dish",
            price: 6.0
        }).save();
        item.newItem({
            name: "Pasta",
            type: "Dish",
            price: 5.0
        }).save();
        item.newItem({
            name: "Croccantelle",
            type: "Dish",
            price: 1.0
        }).save();
        item.newItem({
            name: "Sandwich",
            type: "Dish",
            price: 4.0
        }).save();
        item.newItem({
            name: "Beer",
            type: "Drink",
            price: 4.0
        }).save();
        item.newItem({
            name: "Coca Cola",
            type: "Drink",
            price: 2.0
        }).save();
        item.newItem({
            name: "Fanta",
            type: "Drink",
            price: 2.0
        }).save();

    } else {
        console.log("Items already exist");
    }
}).then(() => {
    let server = http.createServer(app);
    ios = io(server, {
        cors:
            {
                origin: '*',
            }
    });
    ios.on('connection', (client) => {
        console.log('Socket.io client connected'.green);
    });
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
}).catch((err) => console.log(err));




