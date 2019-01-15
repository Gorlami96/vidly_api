const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User} = require('../models/users');
const Joi = require('joi');

router.post('/' , async (req,res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    let user = await User.findOne({email:req.body.email});
    if(!user) {
        return res.status(400).send('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(req.body.password , user.password);
    if(!validPassword){
        return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ _id:user._id }, 'jwtPrivateKey');

    res.send(token);
});

function validate(user){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user , schema);
}

module.exports = router;