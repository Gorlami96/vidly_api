const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Movie , validate} = require('../models/movies');
const {Genre} = require('../models/genres');

router.get('/' , async(req,res) => {
    const movies = await Movie.find().sort({title:1});
    res.send(movies);
});

router.post('/' , async(req,res) => {
    const{ error } = validate(req.body)
    if(error){
        res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre){
        res.status(400).send('Invlaid genre id');
        return;
    }

    let movie = new Movie({
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    });
    movie = await movie.save();
    
    res.send(movie);
});

router.get('/:id', async(req,res) =>{
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        res.status(404).send('Movie id does not exist');
    }

    res.send(movie);
});

router.put('/:id' , async(req,res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre){
        res.status(400).send("Invalid genre");
        return;
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id , {
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    });
    if(!movie){
        res.status(404).send('The given movie id does not exist');
        return;
    }

    res.send(movie);
});

router.delete('/:id' , async(req,res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie){
        res.status(404).send('Given id does not exist');
        return
    }
    res.send(customer);
});

module.exports = router;