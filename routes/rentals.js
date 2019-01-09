const {Rental , validate} = require('../models/rentals');
const {Movie} = require('../models/movies');
const {Customer} = require('../models/customers');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/' , async(req,res) => {
    const rentals = Rental.find().sort({dateOut:1});
    res.send(rentals);
});

router.post('/' , async(req,res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const movie = await Movie.findById(req.body.movieId);
    if(!movie){
        res.status(400).send('Invalid movie id');
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer){
        res.status(400).send('Invalid customer id');
    }

    let rental = new Rental({
        customer:{
            _id:customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    try{
        new Fawn.Task()
            .save('rentals',rental)
            .update('movies',{_id: movie._id} , {
                $inc : {numberInStock: -1}
            })
            .run();

            res.send(rental);
    }
    catch(ex){
        res.status(500).send('Something failed');
    }
});

router.get('/' , async(req,res) =>{
    const rental = await Rental.findById(req.params.id);
    if(!rental){
        res.status(404).send('Rental id does not exist');
    }
    res.send(rental);
});

module.exports = router;