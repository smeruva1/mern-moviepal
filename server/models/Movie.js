const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedMovies` array in User.js
const movieSchema = new Schema({

  popularity: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  vote_average: {
    type: String,
  },
  overview: {
    type: String,
  },
  release_date: {
    type: Date,
  },


  // authors: [
  //   {
  //     type: String,
  //   },
  // ],
  // description: {
  //   type: String,
  //   required: true,
  // },
  // // saved movie id from themoviedb
  // movieId: {
  //   type: String,
  //   required: true,
  // },
  // image: {
  //   type: String,
  // },
  // link: {
  //   type: String,
  // },
  // title: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = movieSchema;
