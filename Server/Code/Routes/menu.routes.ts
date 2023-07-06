import * as item from "../Models/Item";
import {Item} from "../Models/Item";

const express = require('express');

export const menuRouter = express.Router();
//tablesRouter.use(express.json());
menuRouter.get("/", (req, res) => {
    item.getModel().find({}).sort({type:1}).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        return res.status(404).json({error:'DB error: ' + err});
    });
});
menuRouter.delete("/:name", (req, res) => {
    if(req.auth.role != 'Cashier')
        return res.status(401).json({ error: "You are not an admin"});
    let name = req.params.name;
    if (name == undefined)
        return res.status(400).json({error: 'Given params are not correct'});
    item.getModel().deleteOne({name: name}).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        return res.status(404).json({error: 'User not found: ' + err});
    });
});
menuRouter.post("/", (req, res) => {
    if(req.auth.role != 'Cashier')
        return res.status(401).json({ error: "You are not an admin"});
    if (req.body.name == undefined || req.body.price == undefined || (req.body.type != 'Dish' && req.body.type != 'Drink')) {
        return res.status(400).json({error: 'Given params are not correct'});
    }
    item.newItem(req.body).save().then((item) => {
        return res.status(200).json(item);
    }).catch((err) => {
        return res.status(404).json({error: 'Mongo error: '+ err});
    });
});

