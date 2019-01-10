const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User , validate} = require('../models/users');

router.post('/' , async (req,res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    let user = await User.findOne({email:req.body.email});
    if(user) {
        return res.status(400).send('User already registered');
    }
    user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });

    await user.save();
    res.send(user);
});

module.exports = router;