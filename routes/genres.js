const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');

const Genre = mongoose.model('Genres' , new mongoose.Schema({
    name:{
        type:String ,
        required:true,
        minlength:5,
        maxlength:50
    }
}));

router.get('/' , async (req,res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id' , async(req ,res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre){
        res.status(404).send('Genre id does not exist');
    }
    res.send(genre);
    //console.log(req.params.id);
});

router.post('/' , async (req,res) => {
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    let genre = new Genre({
        name:req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

router.put('/:id' , async (req,res) => {
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{
        new:true
    });
    if(!genre){
        res.status(400).send('Invalid genre id');
        return;
    }
    res.send(genre);

});

router.delete('/:id' , async (req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre){
        res.status(400).send('genre id not found');
        return;
    }

    res.send(genre);
});

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre , schema);
}


module.exports = router;