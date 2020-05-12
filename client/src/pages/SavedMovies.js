import React, { useEffect, useState, useContext } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
// import context for global state
import UserInfoContext from '../utils/UserInfoContext';

import * as API from '../utils/API';
import AuthService from '../utils/auth';

function SavedMovies() {
  // get whole userData state object from App.js
  const userData = useContext(UserInfoContext);
  
  const Star = (props) => {

    const [rating, setRating] = useState(props.rating);
    const [hover, setHover] = useState(null)
    return (
      <div>
        {[...Array(5)].map((star, i) => {
          const rateValue = i + 1;

          return (
            <label>
              <input type='radio'
                name='rating'
                value={rateValue}
                //onClick={() =>  setRating(rateValue)}
                onClick={() => {
                  // console.log(rateValue, props.id, rating);
                  props.handleRateMovie(props.id, rateValue);
                  // setRating(rateValue);
                }
                }
              />
              <FaStar className='star'
                color={rateValue <= (hover || rating) ? "yellow" : "gray"}
                onMouseEnter={() => setHover(rateValue)}
                onMouseLeave={() => setHover(null)}
              />

            </label>
          )
        })}

      </div>
    )
  }

  const handleRateMovie = (id, rating) => {
    const updatedSearchMovies = [...userData.savedMovies];
    console.log(updatedSearchMovies);
    console.log(userData.savedMovies);

    updatedSearchMovies.forEach(movie => {
      if (movie.id === id) {
        movie.rating = rating;
      }
    });
    //setHome5PopularMoviesResult(userData.savedMovies);
  }


  // create function that accepts the movie's mongo _id value as param and deletes the movie from the database
  const handleDeleteMovie = (movieId) => {
    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }
    API.deleteMovie(movieId, token)
      // upon succes, update user data to reflect movie change
      .then(() => userData.getUserData())
      .catch((err) => console.log(err));
  };

  return (
    <>
      {/* <Jumbotron fluid className='text-light bg-dark'> */}
      <Container>
        <h1>Watchlist!</h1>
      </Container>
      {/* </Jumbotron> */}

      <Container>
        <h2>
          {userData.savedMovies.length
            ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'}:`
            : 'You have no saved movies!'}
        </h2>
        <CardColumns>
          {userData.savedMovies.map((movie) => {
            return (
              <Card key={movie.id} border='dark'>
                {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <h6 className='small netRating'>Popularity: {movie.popularity}</h6>
                  <h6 className='small netRating'>Vote Average: {movie.vote_average}</h6>
                  <h6 className='small fandfRating'>Family Average: {movie.familyRating}</h6>
                  <h6 className='small fandfRating'>Friends Average: {movie.friendRating}</h6>
                  {/* <Card.Text>{movie.overview.substring(0, 100).concat("...")}</Card.Text> */}

                      <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                        userData.savedMovies?.some((savMovie) => savMovie.id === movie.id).rating :
                        movie.rating} id={movie.id} handleRateMovie={handleRateMovie} />

                  {userData.username && (
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteMovie(movie.id)}>
                      Delete this Movie!
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

export default SavedMovies;
