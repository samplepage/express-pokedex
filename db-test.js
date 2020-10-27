const db = require("./models");

/*db.pokemon
  .create({
    names: "Pikachu",
  })
  .then(function (poke) {
    console.log("Created: ", poke.names);
  });*/

db.pokemon.findAll().then(function (poke) {
  console.log("Found: ", poke);
});
/*db.pokemon.destroy({
    where:{id:[1,2]}
})*/
