import * as table from "../Models/Table";
import * as user from "../Models/User";
const express = require('express');
import {ios} from "../index";

export const tablesRouter = express.Router();
//tablesRouter.use(express.json());
tablesRouter.get("/", (req, res) => {
    table.getModel().find({}).sort({number: 1}).then((tables) => {
        return res.status(200).json(tables);
    }).catch((err) => {
        return res.status(404).json({error: 'Error getting tables: ' + err});
    });

});
tablesRouter.post("/", (req, res) => {
    if (req.body.number == undefined || req.body.seats == undefined || !req.body.isFree || req.body.bill != 0)
        return res.status(400).json({error: "Given Params are not correct"});
    table.newTable(req.body).save().then((table) => {
        notify();
        return res.status(200).json({error: "", id: table._id});
    }).catch((err) => {
        return res.status(400).json({error: "Given Params are not correct"});
    });
});

tablesRouter.delete('/:tableid', (req, res) => {
    if(req.params.tableid == undefined)
        return res.status(404).json({error: "Invalid table id"});
    table.getModel().deleteOne({number: req.params.tableid}).then((table) => {
        if (table.deletedCount > 0) {
            notify();
            return res.status(200).json({message: 'User deleted'});
        } else
            return res.status(404).json({error: "Invalid table id"});
    }).catch((err) => {
        return res.status(404).json({error: "Mongo error: " + err});
    })

    console.log('DELETE request for items related to table: ' + req.params.tableid);
});

tablesRouter.put("/:number", (req, res) => {
    const filter = {
        number: req.params.number
    };
    let update = {};
    if (req.query.action == 'occupy')
        update = {
            isFree: false,
            waiter: req.query.email
        };
    else if (req.query.action == 'free')
        update = {
            isFree: true,
            waiter: null
        };
    table.getModel().findOneAndUpdate(filter, update, {new: true}).then((table) => {
        notify();
        return res.status(200).json({message: "Ok, table "+table+" status updated"});
    }).catch((err) => {
        return res.status(404).json({error: "Table not found: " + err});
    });
});

function notify() {
    let m = 'Hello';
    ios.emit('tables', m);
}







