import axios from 'axios';

export const getAllUsers = function () {
  return axios.get('/api/users');
};

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
  return axios.put('/api/users', movieData, { headers: { authorization: `Bearer ${token}` } });
};
// remove saved movie data for a logged in user
export const deleteMovie = function (movieId, token) {
  return axios.delete(`/api/users/movies/${movieId}`, { headers: { authorization: `Bearer ${token}` } });
};

// make a search to The movie DB api
// https://www.googleapis.com/movies/v1/volumes?q=harry+potter
export const searchTheMovies = function (query) {
console.log(query);
  // return axios.get('https://www.googleapis.com/movies/v1/volumes', { params: { q: query } });
  return axios.get('https://api.themoviedb.org/3/search/movie?api_key=1fec72236532ee89a303c5cc707f12e4&query=' + query);
  
};
