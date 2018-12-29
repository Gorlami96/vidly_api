const express = require('express');
const router = express.Router();

const genres =[
    {id:1 , name:'Action'},
    {id:2 , name:'Horror'},
    {id:3 , name:'Sci-fi'},
    {id:4 , name:'Fantasy'},
    {id:5 , name:'Crime'}
];

router.get('/' , (req,res) => {
    res.send(genres);
});

router.get('/:id' , (req ,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('Genre id does not exist');
    }
    res.send(genre);
});

router.post('/' , (req,res) => {
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = {
        id: genres.length + 1 ,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

router.put('/:id' , (req,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(400).send('Invalid genre id');
        return;
    }

    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    genre.name = req.body.name;
    res.send(genre);

});

router.delete('/:id' , (req,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(400).send('genre id not found');
        return;
    }

    const index = genres.indexOf(genre);
    genres.splice(index,1);

    res.send(genre);
});

module.exports = router;