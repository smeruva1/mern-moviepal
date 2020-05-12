import React, { useState, useContext, useEffect } from 'react';
import {Container, Button, Card, CardColumns } from 'react-bootstrap';

import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import { saveMovie, popularTheMovies, newTheMovies, topRatedTheMovies } from '../utils/API';

function HomeMovies() {
  // create state for holding returned The Movie api data
  const [home5PopularMoviesResult, setHome5PopularMoviesResult] = useState([]);
  const [home5TopRatedMoviesResult, setHome5TopRatedMoviesResult] = useState([]);
  const [home5NewMoviesResult, setHome5NewMoviesResult] = useState([]);

  const userData = useContext(UserInfoContext);

  useEffect(() => {
    popularTheMovies()
      .then(({ data }) => {
        console.log(data);
        const movieData = data.results.slice(0, 5).map((movie) => ({
          popularity: movie.popularity,
          poster_path: movie.poster_path,
          id: movie.id,
          title: movie.title,
          vote_average: movie.vote_average,
          overview: movie.overview,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids,
        }));
        return setHome5PopularMoviesResult(movieData);
      })
      .catch((err) => console.log(err));

    topRatedTheMovies()
      .then(({ data }) => {
        console.log(data);
        const movieData = data.results.slice(0, 5).map((movie) => ({
          popularity: movie.popularity,
          poster_path: movie.poster_path,
          id: movie.id,
          title: movie.title,
          vote_average: movie.vote_average,
          overview: movie.overview,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids,
        }));
        return setHome5TopRatedMoviesResult(movieData);
      })
      .catch((err) => console.log(err));

    newTheMovies()
      .then(({ data }) => {
        console.log(data);
        const movieData = data.results.slice(0, 5).map((movie) => ({
          popularity: movie.popularity,
          poster_path: movie.poster_path,
          id: movie.id,
          title: movie.title,
          vote_average: movie.vote_average,
          overview: movie.overview,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids,
        }));
        return setHome5NewMoviesResult(movieData);
      })
      .catch((err) => console.log(err));

  }, [])

  // create function to handle saving a movie to our database
  const handleSaveMovie = (id, category) => {
    // find the movie in `HomeMovies` state by the matching id
    let movieToSave = [];

    if (category === "popular") {
      const movieToSave = home5PopularMoviesResult.find((movie) => movie.id === id);
    } else if (category === "toprated") {
      const movieToSave = home5TopRatedMoviesResult.find((movie) => movie.id === id);
    } else if (category === "New") {
      const movieToSave = home5NewMoviesResult.find((movie) => movie.id === id);
    }

    console.log(movieToSave);
    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }


    // send the movies data to our api

    saveMovie(movieToSave, token)
      .then(() => userData.getUserData())
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Container className="homeContainer">
       
        <Container>
          <h1>Home</h1>
        </Container>
       

        <Container>
          <h2>{home5PopularMoviesResult.length ? `Viewing Popular ${home5PopularMoviesResult.length} Movies:` : 'Search for a movie to begin'}</h2>
          <CardColumns>
            {home5PopularMoviesResult.map((movie) => {
              return (
                <Card key={movie.id} border='dark'>
                  {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <h6 className='small'>Popularity: {movie.popularity}</h6>
                    <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                    <Button
                      disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id == movie.id)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movie.id)}>
                      {userData.savedMovies?.some((savedMovie) => savedMovie.id == movie.id)
                        ? 'In Watchlist!'
                        : 'Add to Watchlist!'}
                    </Button>
                  )}
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        </Container>


        <Container>
          <h2>{home5TopRatedMoviesResult.length ? `Viewing Top Rated ${home5TopRatedMoviesResult.length} Movies:` : 'Search for a movie to begin'}</h2>
          <CardColumns>
            {home5TopRatedMoviesResult.map((movie) => {
              return (
                <Card key={movie.id} border='dark'>
                  {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <h6 className='small'>Popularity: {movie.popularity}</h6>
                    <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                      <Button
                        disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveMovie(movie.id, "popular")}>
                        {userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)
                          ? 'In Watchlist!'
                          : 'Add to Watchlist!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        </Container>


        <Container>
          <h2>{home5NewMoviesResult.length ? `Viewing New ${home5NewMoviesResult.length} Movies:` : 'Search for a movie to begin'}</h2>
          <CardColumns>
            {home5NewMoviesResult.map((movie) => {
              return (
                <Card key={movie.id} border='dark'>
                  {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <h6 className='small'>Popularity: {movie.popularity}</h6>
                    <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                    <Button
                      disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id == movie.id)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movie.id)}>
                      {userData.savedMovies?.some((savedMovie) => savedMovie.id == movie.id)
                        ? 'In Watchlist!'
                        : 'Add to Watchlist!'}
                    </Button>
                  )}
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        </Container>
      </Container>
    </>
  );
}

export default HomeMovies;
