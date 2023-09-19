const express = require('express');
const app = express();
app.use(express.json());


const connection  = require('./config');

app.get('/categories', function(req, res){
    connection.query('SELECT * FROM category', function(error, result){
    if (error) throw error;
    return res.send({data: result});
});
});
app.get('/films', function(req, res){
    connection.query('SELECT film.title FROM film', function(error, result){
    if (error) throw error;
    return res.send({data: result});
});
});

app.get('/actors', function(req, res){
    connection.query('SELECT actor.first_name  FROM actor ORDER BY actor.last_name LIMIT 10;', function(error, result){
    if (error) throw error;
    return res.send({data: result});
});
});
app.get('/category/:name', function(req, res) {
    const categoryId = req.params.name;
  
    connection.query(
      'SELECT film.title, category.name FROM film_category, film, category ' +
      'WHERE film_category.film_id = film.film_id ' +
      'AND film_category.category_id = category.category_id ' +
      'AND category.name = ?',
      [categoryId],
      function(error, result) {
        if (error) throw error;
        return res.send({data: result});
    });
    ;
  });

  app.get('/actor/:id', function(req, res) {
    const categoryId = req.params.id;
  
    connection.query(
        'SELECT film.title FROM film, actor, film_actor ' +
        'WHERE film_actor.film_id = film.film_id ' +
        'AND film_actor.actor_id = actor.actor_id ' +
        'AND actor.actor_id = ?',
      [categoryId],
      function(error, result) {
        if (error) throw error;
        return res.send({data: result});
    });
    ;
  });



  app.get('/actorln/:last_name', function(req, res) {
    const actorLastName = req.params.last_name;
  
    connection.query(
      'SELECT film.title FROM film INNER JOIN film_actor ON film.film_id = film_actor.film_id INNER JOIN actor ON film_actor.actor_id = actor.actor_id WHERE actor.last_name = ?',
      [actorLastName],
      function(error, result) {
        if (result.length === 0) {
          return res.send({ message: `Actor with last name '${actorLastName}' not found.` });
        } else {
          return res.send({ data: result });
        }
      }
    );
  });
  
  app.get('/actorDO', function(req, res) {
    const categoryId = req.params.id;
  
    connection.query(
    'SELECT film.title FROM film JOIN film_actor ON film.film_id = film_actor.film_id JOIN actor ON film_actor.actor_id = actor.actor_id WHERE actor.last_name LIKE "DO%"',
      [categoryId],
      function(error, result) {
        if (result.length === 0) {
          return res.send({ message: `Actor with last name '${categoryId}' not found.` });
        } else {
          return res.send({ data: result });
        }
      });
    ;
  });
  

  app.get('/FCBG', function(req, res) {
    connection.query(
      'SELECT category.name, COUNT(film.film_id) ' +
      'FROM film ' +
      'JOIN film_category ON film.film_id = film_category.film_id ' +
      'JOIN category ON film_category.category_id = category.category_id ' +
      'GROUP BY genre_name',
      function(error, result) {
        if (error) {
          throw error;
        }
        return res.send({ data: result });
      }
    );
  });
  

  app.get('/CBNF', function(req, res) {
    const categoryId = req.params.id;
  
    connection.query(
    'SELECT category.name, COUNT(film.film_id) FROM film JOIN film_category ON film.film_id = film_category.film_id JOIN category ON film_category.category_id =category.category_id GROUP BY category.name',
      [categoryId],
      function(error, result) {
        if (error) throw error;
        return res.send({data: result});
    }
    );
  });










  app.post('/namecategory', (req, res) => {
    connection.query('INSERT INTO category SET ?', req.body, (error, result) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ error: 'Duplicate entry for category name' });
        } 
      } else {
        res.status(201).send(`Category added with ID: ${result.insertId}`);
      }
    });
  });
  


















  app.put('/namecategories/:name', (req, res)=>{
    const name = req.params.name
    connection.query('UPDATE category SET ? WHERE category.name = ?', [req.body, name],(error)=>{
      if (error) throw error;
      res.status(200).send(`Category ${name} updated successfully.`)
    }
    );
  });

  app.delete('/namecategory/:name', (req, res)=>{
    const name = req.params.name
    connection.query('DELETE FROM category WHERE category.name = ?', name, (error)=>{
      if(error) throw error;
      res.status(200).send(`Category ${name} deleted.`)
    })
  })


  app.post('/namefilm/:name', (req, res)=>{
    const name = req.params.name
    connection.query('INSERT INTO `film`(`film_id`, `title`, `description`, `release_year`, `language_id`, `original_language_id`, `rental_duration`, `rental_rate`, `length`, `replacement_cost`, `rating`, `special_features`, `last_update`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', name, (error)=>{
      if(error) throw error;
      res.status(200).send(`Film ${name} add.`)
    })
  })

app.listen(2001)