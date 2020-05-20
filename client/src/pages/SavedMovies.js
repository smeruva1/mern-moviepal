import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Card, Row, Col, ListGroup } from 'react-bootstrap';
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

  //To store user names and id's
  const [allUsers, setallUsers] = useState([]);
  const [allFriends, setallFriends] = useState([]);
  const [allFamily, setallFamily] = useState([]);

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

  useEffect(() => {

    API.getAllUsers()
      .then(({ data }) => {
        console.log(data);
        const userInfo = data.map((user) => ({
          id: user.id,
          username: user.username
        }));
        return setallUsers(userInfo);
      })
      .catch((err) => console.log(err));

  }, [])


  return (
    <>
      <br></br>
      <Container fluid="md">
        <Row>
          <Col sm>
            <ListGroup>
              <ListGroup.Item style={{ backgroundColor: "#2F2F4F", color: "white", opacity: "0.9" }}>My Family</ListGroup.Item>
              {userData.family.map((family) => {
                return (
                  <ListGroup.Item style={{ backgroundColor: "white", color: "grey", opacity: "0.9" }}>
                    {allUsers?.some((allUser) => allUser.id == family)
                      ? allUsers?.find((allUser) => allUser.id == family).username
                      : null}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>

          </Col>

          <Col sm>
            <ListGroup>
              <ListGroup.Item style={{ backgroundColor: "#2F2F4F", color: "white", opacity: "0.9" }}>My Friends</ListGroup.Item>
              {userData.friends.map((friend) => {
                return (
                  <ListGroup.Item style={{ backgroundColor: "white", color: "grey", opacity: "0.9" }}>
                    {allUsers?.some((allUser) => allUser.id == friend)
                      ? allUsers?.find((allUser) => allUser.id == friend).username
                      : null}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <br></br>
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
              <Col className="mb-3" xs={12} md={4} lg={3}>
                {/* <Card key={movie.id} style={{ width: '10rem', margin: "4px" }} border='dark'> */}
                <Card key={movie.id} border='dark'>

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
