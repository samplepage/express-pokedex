require('dotenv').config();
const express = require('express');
const axios = require('axios'); 
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 3000;
const db = require("./models");
const { response } = require('express');
const methodOverride = require('method-override')

app.use(methodOverride('_method'))
app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'))

// GET / - main index of site
app.get('/', function(req, res) {
  const pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
  // Use request to call the API
  axios.get(pokemonUrl).then( function(apiResponse) {
    const pokemon = apiResponse.data.results;
    res.render('index', { pokemon: pokemon.slice(0, 151) });
  })
});
app.get('/pokemon',(req, res)=>{
  db.pokemon.findAll().then(function (poke) {
    res.render('index', {pokemon:poke})
  })
})
app.post('/pokemon', (req, res)=>{
  db.pokemon
  .create({
    names: req.body.name,
  })
  .then(function (poke) {
    console.log("Created: ", poke.names);
    res.redirect('/pokemon')
  });
})

app.delete('/pokemon/:id', (req, res)=>{
  //res.send(`trying to delete this favorite ${req.params.id}`)
  //console.log('trying to delete this')
  db.pokemon.destroy({
    where:{id:req.params.id}
  })
  res.redirect('/')
})

app.get('/pokemon/:id', (req, res)=>{
  const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/'
  let pokemonId = req.params.id
  axios.get(pokemonUrl + pokemonId)
  .then(response=>{
    res.render('show.ejs', {pokemon: response.data})
  })
  .catch(err=>{
    console.log('there was an error')
  })
})


// Imports all routes from the pokemon routes file
app.use('/pokemon', require('./routes/pokemon'));

const server = app.listen(port, function() {
  console.log('...listening on', port );
});

module.exports = server;
