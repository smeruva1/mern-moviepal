import React, { useState, useContext, useEffect } from 'react';
import { Jumbotron, Container, Row, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import { saveMovie, tvShowsTheMovies } from '../utils/API';

function TVShowsMovies() {
  // create state for holding returned The Movie api data
  const [tvShowsMoviesResult, setTVShowsMoviesResult] = useState([]);

  const userData = useContext(UserInfoContext);

  useEffect(() => {
    tvShowsTheMovies()
      .then(({ data }) => {
        console.log(data);
        const movieData = data.results.map((movie) => ({
          popularity: movie.popularity,
          poster_path: movie.poster_path,
          id: movie.id,
          title: movie.title,
          vote_average: movie.vote_average,
          overview: movie.overview,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids,
        }));
        return setTVShowsMoviesResult(movieData);
      })
      .catch((err) => console.log(err));
  }, [])

  // create function to handle saving a movie to our database
  const handleSaveMovie = (id) => {
    // find the movie in `TVShowsMovies` state by the matching id
    const movieToSave = tvShowsMoviesResult.find((movie) => movie.id === id);
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
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>TVShows Movies!</h1>
        </Container>
      </Jumbotron>

      <Container>
        <h2>{tvShowsMoviesResult.length ? `Viewing ${tvShowsMoviesResult.length} results:` : 'Search for a movie to begin'}</h2>
        <CardColumns>
          {tvShowsMoviesResult.map((movie) => {
            return (
              <Card key={movie.id} border='dark'>
                {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <p className='small'>Popularity: {movie.popularity}</p>
                  <p className='small'>Vote Average: {movie.vote_average}</p>
                  <Card.Text>{movie.overview}</Card.Text>
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
    </>
  );
}

export default TVShowsMovies;
