import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import { saveMovie, popularTheMovies, newTheMovies, topRatedTheMovies } from '../utils/API';
import MoviePosterPlaceHolder from '../images/MoviePosterPlaceHolder.png';

function HomeMovies() {
  // create state for holding returned The Movie api data
  const [home5PopularMoviesResult, setHome5PopularMoviesResult] = useState([]);
  const [home5TopRatedMoviesResult, setHome5TopRatedMoviesResult] = useState([]);
  const [home5NewMoviesResult, setHome5NewMoviesResult] = useState([]);

  const userData = useContext(UserInfoContext);

  const category = ["popular", "toprated", "new"];

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
                  props.handleRateMovie(props.id, rateValue, props.category);
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

  const handleRateMovie = (id, rating, category) => {

    //console.log(category, id, rating);

    let movieToSave = {};

    if (category === "popular") {
      movieToSave = home5PopularMoviesResult.find((movie) => movie.id === id);
      movieToSave = home5PopularMoviesResult;
    } else if (category === "toprated") {
      movieToSave = home5TopRatedMoviesResult.find((movie) => movie.id === id);
      movieToSave = home5TopRatedMoviesResult;
    } else if (category === "new") {
      movieToSave = home5NewMoviesResult.find((movie) => movie.id === id);
      movieToSave = home5NewMoviesResult;
    }

    //console.log(movieToSave);

    const updatedSearchMovies = [...movieToSave];
    // console.log(updatedSearchMovies);
    // console.log(movieToSave);

    updatedSearchMovies.forEach(movie => {
      if (movie.id === id) {
        movie.rating = rating;
      }
    });

    if (category === "popular") {
      setHome5PopularMoviesResult(updatedSearchMovies);
    } else if (category === "toprated") {
      setHome5TopRatedMoviesResult(updatedSearchMovies);
    } else if (category === "new") {
      setHome5NewMoviesResult(updatedSearchMovies);
    }

  }

  useEffect(() => {
    popularTheMovies()
      .then(({ data }) => {
        //console.log(data);
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
        //console.log(data);
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
        //console.log(data);
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
      movieToSave = home5PopularMoviesResult.find((movie) => movie.id === id);
    } else if (category === "toprated") {
      movieToSave = home5TopRatedMoviesResult.find((movie) => movie.id === id);
    } else if (category === "new") {
      movieToSave = home5NewMoviesResult.find((movie) => movie.id === id);
    }


    // console.log(movieToSave);
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
      <Container fluid="md">
        <Row>          
          <h2>{home5PopularMoviesResult.length ? `Viewing Popular ${home5PopularMoviesResult.length} Movies:` : 'Search for a movie to begin'}</h2>
        </Row>

        <Row>
          {home5PopularMoviesResult.map((movie) => {
            return (
              <Col sm>
                <Card key={movie.id} style={{ width: '10rem', margin: "4px" }} border='dark' className="w3-card">
                  {movie.poster_path ? 
                  <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' className="w3-card" /> : 
                  <Card.Img src={MoviePosterPlaceHolder} alt={`the cover for ${movie.title}`} variant='top' className="w3-card" />}
                  <Card.Body className="w3-card">
                    <Card.Title className="w3-card">{movie.title}</Card.Title>
                    <h6 className='small'>Popularity: {movie.popularity}</h6>
                    <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                      <div>

                        <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                          userData.savedMovies?.find((savMovie) => savMovie.id === movie.id).rating :
                          movie.rating} id={movie.id} handleRateMovie={handleRateMovie} category={category[0]} />

                        <Button
                          disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)}
                          className='btn-block btn-info'
                          onClick={() => handleSaveMovie(movie.id, "popular")}>
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

        <Row>

          <h2>{home5TopRatedMoviesResult.length ? `Viewing Top Rated ${home5TopRatedMoviesResult.length} Movies:` : 'Search for a movie to begin'}</h2>
        </Row>

        <Row>
          {home5TopRatedMoviesResult.map((movie) => {
            return (
              <Col sm>
                <Card key={movie.id} style={{ width: '10rem', margin: "4px" }} border='dark'>
                  {movie.poster_path ? 
                  <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' className="w3-card" /> : 
                  <Card.Img src={MoviePosterPlaceHolder} alt={`the cover for ${movie.title}`} variant='top' className="w3-card" />}

                  <Card.Body>
                    <Card.Title className="w3-card">{movie.title}</Card.Title>
                    <h6 className='small'>Popularity: {movie.popularity}</h6>
                    <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                      <div>

                        <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                          userData.savedMovies?.find((savMovie) => savMovie.id === movie.id).rating :
                          movie.rating} id={movie.id} handleRateMovie={handleRateMovie} category={category[1]} />

                        <Button
                          disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)}
                          className='btn-block btn-info'
                          onClick={() => handleSaveMovie(movie.id, "toprated")}>
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

        <Row>
          <h2>{home5NewMoviesResult.length ? `Viewing New ${home5NewMoviesResult.length} Movies:` : 'Search for a movie to begin'}</h2>
        </Row>

        <Row>
          {home5NewMoviesResult.map((movie) => {
            return (
              <Col sm>
                <Card key={movie.id} style={{ width: '10rem', margin: "4px" }} border='dark'>
                  {movie.poster_path ? 
                  <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : 
                  <Card.Img src={MoviePosterPlaceHolder} alt={`the cover for ${movie.title}`} variant='top' className="w3-card" />}
                  <Card.Body>
                    <Card.Title className="w3-card">{movie.title}</Card.Title>
                    <h6 className='small'>Popularity: {movie.popularity}</h6>
                    <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                    {/* <Card.Text>{movie.overview}</Card.Text> */}
                    {userData.username && (
                      <div>

                        <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === movie.id) ?
                          userData.savedMovies?.find((savMovie) => savMovie.id === movie.id).rating :
                          movie.rating} id={movie.id} handleRateMovie={handleRateMovie} category={category[2]} />

                        <Button
                          disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id === movie.id)}
                          className='btn-block btn-info'
                          onClick={() => handleSaveMovie(movie.id, "new")}>
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

export default HomeMovies;
