import React, { useState, useContext } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import context for global state
import UserInfoContext from '../utils/UserInfoContext';

import * as API from '../utils/API';
import AuthService from '../utils/auth';
import MoviePosterPlaceHolder from '../images/MoviePosterPlaceHolder.png';

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
    // console.log(updatedSearchMovies);
    // console.log(userData.savedMovies);

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

      <Container>
        <h3>
          {userData.savedMovies.length
            ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'}:`
            : 'You have no saved movies!'}
        </h3>        
      </Container>

      {/* <div class="w3-row">*/}
      {/* <Container className="w3-half w3-container w3-mobile w3-quarter"> */}
      <Container fluid="md">
        {/* <CardColumns> */}
        <Row>
          {userData.savedMovies.map((movie) => {
            return (
              <Col sm>
                <Card key={movie.id} style={{ width: '10rem', margin: "4px" }} border='dark'>

                  {movie.poster_path ? <Link to={'/moviedetails/' + movie.id}> <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> </Link> : null}


                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <h6 className='small netRating'>Popularity: {movie.popularity}</h6>
                    <h6 className='small netRating'>Vote Average: {movie.vote_average}</h6>
                    <h6 className='small fandfRating'>Family Average: {movie.familyRating}</h6>
                    <h6 className='small fandfRating'>Friends Average: {movie.friendRating}</h6>

                    <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                      userData.savedMovies?.find((savMovie) => savMovie.id === movie.id).rating :
                      movie.rating} id={movie.id} handleRateMovie={handleRateMovie} />

                    {userData.username && (
                      <Button className='btn-block btn-danger' onClick={() => handleDeleteMovie(movie.id)}>
                        Delete this Movie!
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        {/* </CardColumns> */}
      </Container>
    </>
  );
}

export default SavedMovies;
