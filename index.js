const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre , schema);
}

const genres =[
    {id:1 , name:'Action'},
    {id:2 , name:'Horror'},
    {id:3 , name:'Sci-fi'},
    {id:4 , name:'Fantasy'},
    {id:5 , name:'Crime'}
];

app.get('/' , (req,res) => {
    res.send('Hello World!');
});

app.get('/api/genres' , (req,res) => {
    res.send(genres);
});

app.get('/api/genres/:id' , (req ,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('Genre id does not exist');
    }
    res.send(genre);
});

app.post('/api/genres' , (req,res) => {
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

app.put('/api/genres/:id' , (req,res) => {
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

app.delete('/api/genres/:id' , (req,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre){
        res.status(400).send('genre id not found');
        return;
    }

    const index = genres.indexOf(genre);
    genres.splice(index,1);

    res.send(genre);
});

const port = process.env.port || 3000 ;
app.listen(port , () => console.log(`Listening on ${port}...`));