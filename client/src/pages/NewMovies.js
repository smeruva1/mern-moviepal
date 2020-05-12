import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Card, CardColumns } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import { saveMovie, newTheMovies } from '../utils/API';

function NewMovies() {
  // create state for holding returned The Movie api data
  const [newMoviesResult, setNewMoviesResult] = useState([]);

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
    const updatedSearchMovies = [...newMoviesResult];
    console.log(updatedSearchMovies);
    console.log(newMoviesResult);

    updatedSearchMovies.forEach(movie => {
      if (movie.id === id) {
        movie.rating = rating;
      }
    });
    setNewMoviesResult(updatedSearchMovies);
  }


  useEffect(() => {
    newTheMovies()
      .then(({ data }) => {
        console.log(data);
        const movieData = data.results.map((movie) => ({
          popularity: movie.popularity,
          poster_path: movie.poster_path,
          id: movie.id,
          title: movie.title,
          vote_average: movie.vote_average,
          overview: movie.overview.substring(0, 100).concat("..."),
          release_date: movie.release_date,
          genre_ids: movie.genre_ids,
        }));
        return setNewMoviesResult(movieData);
      })
      .catch((err) => console.log(err));
  }, [])

  // create function to handle saving a movie to our database
  const handleSaveMovie = (id) => {
    // find the movie in `NewMovies` state by the matching id
    const movieToSave = newMoviesResult.find((movie) => movie.id === id);
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
      {/* <Jumbotron fluid className='text-light bg-dark'> */}
      <Container>
        <h1>New Movies!</h1>
      </Container>
      {/* </Jumbotron> */}

      <Container>
        <h2>{newMoviesResult.length ? `Viewing ${newMoviesResult.length} results:` : 'Search for a movie to begin'}</h2>
        <CardColumns>
          {newMoviesResult.map((movie) => {
            return (
              <Card key={movie.id} border='dark'>
                {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <h6 className='small'>Popularity: {movie.popularity}</h6>
                  <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                  {/* <Card.Text>{movie.overview}</Card.Text> */}
                  {userData.username && (

                    <div>

                      <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                        userData.savedMovies?.some((savMovie) => savMovie.id === movie.id).rating :
                        movie.rating} id={movie.id} handleRateMovie={handleRateMovie} />


                      <Button
                        disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveMovie(movie.id)}>
                        {userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)
                          ? 'In Watchlist!'
                          : 'Add to Watchlist!'}
                      </Button>
                    </div>
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

export default NewMovies;
