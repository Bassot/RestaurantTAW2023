import * as table from "../Models/Table";
import * as user from "../Models/User";
const express = require('express');
import {ios} from "../index";

export const tablesRouter = express.Router();
//tablesRouter.use(express.json());
tablesRouter.get("/", (req, res) => {

    if (req.query.email == undefined) {
        table.getModel().find({}).sort({number: 1}).then((tables) => {
            res.status(200).json(tables);
        }).catch((err) => {
            res.status(500).send('DB error: ' + err);
        });
    } else {
        user.getModel().findOne({email: req.query.email}).then((user) => {
            if (user) {
                table.getModel().find({
                    $or: [
                        {waiter: user._id},
                        {isFree: true}
                    ]
                }).sort({number: 1}).then((tables) => {
                    res.status(200).json(tables);
                });
            }
        }).catch((err) => {
            res.status(500).send('DB error: ' + err);
        });
    }
});
tablesRouter.post("/", (req, res) => {
    if (req.body.number == undefined || req.body.seats == undefined)
        return res.status(500).json({error: true, errormessage: "Given Params are not correct"});
    let t = {
        number: req.body.number,
        seats: req.body.seats,
        isFree: true,
        bill: 0
    }
    table.newTable(t).save().then((table) => {
        notify();
        return res.status(200).json({error: false, errormessage: "", id: table._id});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: "DB error: " + err});
    });
});

tablesRouter.delete('/:tableid', (req, res) => {
    table.getModel().deleteOne({number: req.params.tableid}).then((table) => {
        if (table.deletedCount > 0) {
            notify();
            return res.status(200).json({error: false, errormessage: ""});
        } else
            return res.status(404).json({error: true, errormessage: "Invalid table id"});
    }).catch((err) => {
        return res.status(404).json({error: true, errormessage: "Mongo error: " + err});
    })

    console.log('DELETE request for items related to table: ' + req.params.tableid);
});

tablesRouter.put("/:number", (req, res) => {
    user.getModel().findOne({email: req.query.email}).then((user) => {
        if (user != null) {
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
                return res.status(200).send("Ok, table occupied: " + table);
            }).catch((err) => {
                return res.status(500).send('DB error: ' + err);
            });
        } else {
            console.log("sticazzi");
        }
    });
});

function notify() {
    let m = 'Hello';
    ios.emit('tables', m);
}







