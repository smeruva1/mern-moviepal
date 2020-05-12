import axios from 'axios';
require('dotenv').config();

export const getAllUsers = function () {
  return axios.get('/api/users');
};

export const getMovieRating = function (movieid, users, token) {
  return axios.get(`/api/users/movies/${movieid}/${users.join(',')}`,{ headers: { authorization: `Bearer ${token}` } });
}

// route to get logged in user's info (needs the token)
export const getMe = function (token) {
  return axios.get('/api/users/me', { headers: { authorization: `Bearer ${token}` } });
};

// get a user by their username, not being used in the app just showing how it could work
export const getUser = function (username) {
  return axios.get(`/api/users/${username}`);
};

export const createUser = function (userData) {
  return axios.post('/api/users', userData);
};

export const loginUser = function (userData) {
  return axios.post('/api/users/login', userData);
};

// save movie data for a logged in user
export const saveMovie = function (movieData, token) {
  console.log(movieData);
  console.log(token);

  return axios.put('/api/users', movieData, { headers: { authorization: `Bearer ${token}` } });
};
// remove saved movie data for a logged in user
export const deleteMovie = function (movieId, token) {
  return axios.delete(`/api/users/movies/${movieId}`, { headers: { authorization: `Bearer ${token}` } });
};

// make a search to The movie DB api
export const searchTheMovies = function (query) {
  //console.log(query);
  // return axios.get('https://api.themoviedb.org/3/search/movie?api_key=1fec72236532ee89a303c5cc707f12e4&query=' + query);
  return axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + process.env.REACT_APP_THEMOVIEDB + '&query=' + query);

};

//popular movies
export const popularTheMovies = function () {
  //console.log("Hi from popular API axios call");
  return axios.get('https://api.themoviedb.org/3/movie/popular?api_key=' + process.env.REACT_APP_THEMOVIEDB + '&language=en-US&page=1');
};

//new movies
export const newTheMovies = function () {
  return axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=' + process.env.REACT_APP_THEMOVIEDB + '&language=en-US&page=1');
};

//Top Rated movies
export const topRatedTheMovies = function () {
  return axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=' + process.env.REACT_APP_THEMOVIEDB + '&language=en-US&page=1');
};

//TV Shows 
export const tvShowsTheMovies = function () {
  return axios.get('https://api.themoviedb.org/3/tv/popular?api_key=' + process.env.REACT_APP_THEMOVIEDB + '&language=en-US&page=1');
};
