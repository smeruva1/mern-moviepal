import React, { useState, useEffect, useContext } from 'react';
import { Jumbotron, Container, Row, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import { saveMovie, searchTheMovies } from '../utils/API';

function SearchMovies() {
  // create state for holding returned The Movie api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  const userData = useContext(UserInfoContext);

    const Star = (props) => {

      console.log("Hi from Star");
  
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
                  // onClick={() =>  setRating(rateValue)}
                  onClick={() => props.handleRateMovie(props.id, rateValue)}
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

  // create method to search for movies and set state on form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }


    searchTheMovies(searchInput)
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
          rating:0,
        }));
        console.log(movieData);

        return setSearchedMovies(movieData);
      })
      .then(() => setSearchInput(''))
      .catch((err) => console.log(err));
  };

  const handleRateMovie = (id, rating) => {
    const updatedSearchMovies = [...searchedMovies];
    console.log("Hi from handleRateMovie");
    console.log("value of id:  "+ id);
    console.log("value of rating:  "+ rating);

    updatedSearchMovies.forEach(movie => {
        if(movie.id === id) {
          
          movie.rating = rating;
          console.log("inside if of handleRateMovie");
            console.log("value of id:  "+ id);
          console.log("value of rating:  "+ rating);

        }
    });
    setSearchedMovies(updatedSearchMovies);
}

  // create function to handle saving a movie to our database
  const handleSaveMovie = (id) => {
    // find the movie in `searchedMovies` state by the matching id
    const movieToSave = searchedMovies.find((movie) => movie.id === id);
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
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a movie'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg' className="submitBtn">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>{searchedMovies.length ? `Viewing ${searchedMovies.length} results:` : 'Search for a movie to begin'}</h2>
        <CardColumns>
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.id} border='dark'>
                {movie.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={`the cover for ${movie.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <h6 className='small'>Popularity: {movie.popularity}</h6>
                  <h6 className='small'>Vote Average: {movie.vote_average}</h6>
                  <Card.Text>{movie.overview}</Card.Text>

                  <Star rating = {searchedMovies.rating} id = {movie.id}  handleRateMovie = {handleRateMovie}/> 

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

export default SearchMovies;
