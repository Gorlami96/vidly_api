const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly' , {useNewUrlParser:true})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Could not connect to MongoDB"));

app.use(express.json());
app.use('/api/genres' , genres);
app.use('/api/customers' , customers);

const port = process.env.port || 3000 ;
app.listen(port , () => console.log(`Listening on ${port}...`));