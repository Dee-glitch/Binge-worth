const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Parse json in request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Read data from the json file
let movies = require('./movies.json');

// Get the movie list
app.get('/movies', (req, res) => {
  res.json(movies);
})

// Search for a specific movie in the list
app.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  for (let movie of movies) {
    if (movie.id === id) {
      return res.status(200).json(movie);
    }
  }
  res.status(404).send(`Movie with id ${id} could not be found in the database`);
})

// Add a new movie to the list
app.post('/movies', (req, res) => {
  const movie = req.body;
  const id = uuidv4();
  
  const newMovie = {
    title: movie.title,
    director: movie.director,
    release_date: movie.release_date,
    id: id
  };

  if (!movie.title || !movie.director || !movie.release_date) {
    return res.status(400).send('Please include the title, director and release_date of the movie that you want to add');
  }
  movies.push(newMovie);
  res.status(201).send(`Movie with id ${id} added to the database`);
})

// Update a specific movie in the list
app.put('/movies/:id', (req, res) => {
  const id = req.params.id;
  const { title, director, release_date } = req.body;
  const movieToUpdate = movies.find(movie => movie.id === id);
  
  if (movieToUpdate) {
    if (title) movieToUpdate.title = title;
    if (director) movieToUpdate.director = director;
    if (release_date) movieToUpdate.release_date = release_date;
    res.status(200).send(`Movie with the id ${id} has been updated`);
  }
  else {
    res.status(404).send(`Movie with the id ${id} could not be found in database`)
  }
})

// Remove a movie from the list
app.delete('/movies/:id', (req, res) => {
  const id = req.params.id;
  movieToDelete = movies.find(movie => movie.id === id);
  if (typeof movieToDelete === 'undefined') {
    res.status(404).send(`Movie with id ${id} could not be found in the database`);
    return;
  }
  movies.splice(movies.indexOf(movieToDelete), 1);
  res.status(200).send(`Movie with id ${id} deleted from the database`); 
})

// Set the server to listen at port
app.listen(port, () => console.log(`Server listening at port ${port}`));