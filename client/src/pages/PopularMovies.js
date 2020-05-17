import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Card,  Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import { saveMovie, popularTheMovies } from '../utils/API';
import MoviePosterPlaceHolder from '../images/MoviePosterPlaceHolder.png';

function PopularMovies() {
  // create state for holding returned The Movie api data
  const [popularMoviesResult, setPopularMoviesResult] = useState([]);

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
    const updatedSearchMovies = [...popularMoviesResult];
    // console.log(updatedSearchMovies);
    // console.log(popularMoviesResult);

    updatedSearchMovies.forEach(movie => {
      if (movie.id === id) {
        movie.rating = rating;
      }
    });
    setPopularMoviesResult(updatedSearchMovies);
  }

  useEffect(() => {
    popularTheMovies()
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
        return setPopularMoviesResult(movieData);
      })
      .catch((err) => console.log(err));
  }, [])

  // create function to handle saving a movie to our database
  const handleSaveMovie = (id) => {
    // find the movie in `PopularMovies` state by the matching id
    const movieToSave = popularMoviesResult.find((movie) => movie.id === id);
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
      <Container>        
        <h5>{popularMoviesResult.length ? `Viewing ${popularMoviesResult.length} results:` : 'Search for a movie to begin'}</h5>
      </Container>

      {/* <div class="w3-row">*/}
      {/* <Container className="w3-half w3-container w3-mobile w3-quarter"> */}
      <Container fluid="md">
        {/* <CardColumns> */}
        <Row>
          {popularMoviesResult.map((movie) => {
            return (
              <Col sm>
                <Card key={movie.id} style={{ width: '10rem', margin: "4px" }}  border='dark'>
                  {movie.poster_path ? 
                  <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : 
                  <Card.Img src={MoviePosterPlaceHolder} alt={`the cover for ${movie.title}`} variant='top'/>}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text className='small'>Popularity: {movie.popularity}</Card.Text>
                    <Card.Text className='small'>Vote Average: {movie.vote_average}</Card.Text>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                      <div>

                        <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                          userData.savedMovies?.find((savMovie) => savMovie.id === movie.id).rating :
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
              </Col>
            );
          })}
        </Row>
        {/* </CardColumns> */}
      </Container>
    </>
  );
}

export default PopularMovies;
