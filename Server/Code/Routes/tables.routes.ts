import * as table from "../Models/Table";
import * as user from "../Models/User";

const express = require('express');
import {ios} from '../index';

export const tablesRouter = express.Router();
//tablesRouter.use(express.json());
tablesRouter.get("/", (req, res) => {

    if(req.query.email == undefined) {
        table.getModel().find({}).sort({number: 1}).then((tables) => {
            res.status(200).json(tables);
        }).catch((err) => {
            res.status(500).send('DB error: ' + err);
        });
    }
    else{
        user.getModel().findOne({email: req.query.email}).then((user) => {
            if(user) {
                table.getModel().find({$or: [
                    { waiter: user._id },
                    { isFree: true }
                ]}).sort({number: 1}).then((tables) => {
                    res.status(200).json(tables);
                });
            }
        }).catch((err) => {
            res.status(500).send('DB error: ' + err);
        });
    }
});


tablesRouter.put("/:number", (req, res) => {
    user.getModel().findOne({email: req.query.email}).then((user) => {
        if (user!=null) {
            console.log(user._id);
            const filter = {
                number: req.params.number
            };
            let update = {};
            console.log(req.query.action);
            if (req.query.action == 'occupy')
                update = {
                    isFree: false,
                    waiter: user._id
                };

            else if (req.query.action == 'free')
                update = {
                    isFree: true,
                    waiter: null
                };
            table.getModel().findOneAndUpdate(filter, update, {new: true}).then((table) => {
                notify();
                res.status(200).send("Ok, table occupied: " + table);
            }).catch((err) => {
                res.status(500).send('DB error: ' + err);
            });
        }
        else{
            console.log("sticazzi");
        }
    });
});

function notify() {
    let m = 'Hello';
    ios.emit('tables', m);
}







