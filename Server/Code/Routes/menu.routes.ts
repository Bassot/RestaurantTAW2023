import * as item from "../Models/Item";
import {Item} from "../Models/Item";

const express = require('express');

export const menuRouter = express.Router();
//tablesRouter.use(express.json());
menuRouter.get("/", (req, res) => {
    item.getModel().find({}).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        res.status(500).send('DB error: ' + err);
    });
});
menuRouter.delete("/:name", (req, res) => {
    let name = req.params.name;
    if (name == undefined)
        return res.status(500).json({error: true, errormessage: 'Given params are not correct'});
    item.getModel().deleteOne({name: name}).then((items) => {
        return res.status(200).json(items);
    }).catch((err) => {
        return res.status(500).send('DB error: ' + err);
    });
});
menuRouter.post("/", (req, res) => {
    if (req.body.name == undefined || req.body.price == undefined || (req.body.type != 'Dish' && req.body.type != 'Drink')) {
        return res.status(500).json({error: true, errormessage: 'Given params are not correct'});
    }
    const i = {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price
    }
    item.newItem(i).save().then((item) => {
        return res.status(200).json(item);
    }).catch((err) => {
        return res.status(500).send('DB error: ' + err);
    });
});

