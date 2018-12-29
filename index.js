const config = require('config')
const morgann = require('morgan')
const helmet = require('helmet')
const express = require('express');
const app = express();
const Joi = require('joi');
const genres = require('./routes/genres');

app.use(express.json());
app.use('/api/genres' , genres);

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre , schema);
}

app.get('/' , (req,res) => {
    res.send('Hello World!');
});

const port = process.env.port || 3000 ;
app.listen(port , () => console.log(`Listening on ${port}...`));