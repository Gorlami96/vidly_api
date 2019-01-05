const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer , validate} = require('../models/customers');

router.get('/', async(req,res) => {
    const customers = await Customer.find().sort({name:1});
    res.send(customers);
});

router.post('/' , async(req,res)=>{
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    let customer = new Customer({
        name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});

router.get('/:id' , async(req,res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        res.status(404).send('The given id does not exist');
        return;
    }
    res.send(customer);
});

router.put('/:id' , async(req,res) => {

    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold
    } , {new:true});

    if(!customer){
        res.status(404).send('The given id does not exist');
        return;
    }

    res.send(customer);
})

router.delete('/:id' , async(req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer){
        res.status(404).send('Given id does not exist');
        return;
    }
    res.send(customer);
});

module.exports = router;