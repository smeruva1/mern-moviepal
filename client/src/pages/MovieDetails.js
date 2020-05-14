import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as API from '../utils/API';
import { Jumbotron, Container, Row, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import amazonprimevideo from '../images/amazonprimevideo.jpg';
import googleplay from '../images/googleplay.jpg';


function MovieDetails(props) {

    const { match: { params } } = props;

    const userData = useContext(UserInfoContext);

    //movie
    const [Movieinfo, setMovieinfo] = useState({});

    //utelly info 
    const [MovieDetail, setMovieDetail] = useState([]);
    //console.log(params.id);

    //    console.log(UserData.savedMovies);

    let imgsrc = '';

    useEffect(() => {

        //Get and set one movie
        API.searchMovieByID(params.id)
            .then(({ data }) => {
                //console.log(data);

                return setMovieinfo(data);
            })
            .catch((err) => console.log(err));

        // console.log(JSON.stringify(Movieinfo.genres));
        //     const str = "";
        // const genreName = Movieinfo.genres.map(gen => str += gen.name);
        // console.log(str, genreName);

        //get where movie is available to stream
        API.getMovieDetails(params.id)
            .then(({ data }) => {
                console.log(data);
                return setMovieDetail(data.collection.locations);
            })
            .catch((err) => console.log(err));
    }, [])


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
        const updatedSearchMovies = [...Movieinfo];
        // console.log(updatedSearchMovies);
        // console.log(Movieinfo);
        updatedSearchMovies.forEach(movie => {
            if (movie.id === id) {
                movie.rating = rating;
            }
        });
        setMovieinfo(updatedSearchMovies);
    }

    return (
        <>
            <Container>
                <h1>Movie Details</h1>
            </Container>

            <Container>
                <Row>
                    <Col xs={12} md={6}>
                        <Card key={Movieinfo.id} border='dark'>
                            {Movieinfo.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${Movieinfo.poster_path}`} alt={`the cover for ${Movieinfo.title}`} variant='top' /> : null}
                        </Card>
                    </Col>

                    <Col xs={12} md={6}>
                        <Card key={Movieinfo.title} border='dark'>
                            <Card.Body>
                                <Card.Title>{Movieinfo.title}</Card.Title>
                                <Card.Subtitle style={{ fontStyle: 'italic' }}>{Movieinfo.tagline}</Card.Subtitle>
                                <br></br>

                                <Card.Text>{Movieinfo.overview}</Card.Text>
                                <h6 className='small netRating'>Release Date: {Movieinfo.release_date}</h6>
                                <h6 className='small netRating'>Run Time: {Movieinfo.runtime}</h6>
                                <br></br>
                                <h6 className='small netRating'>Popularity: {Movieinfo.popularity}</h6>
                                <h6 className='small netRating'>Vote Average: {Movieinfo.vote_average}</h6>
                                <br></br>
                                <h6 className='small fandfRating'>Family Average: {Movieinfo.familyRating}</h6>
                                <h6 className='small fandfRating'>Friends Average: {Movieinfo.friendRating}</h6>

                                {userData.username && (
                                    <div>

                                        <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === Movieinfo.id) ?
                                            userData.savedMovies?.find((savMovie) => savMovie.id === Movieinfo.id).rating :
                                            Movieinfo.rating} id={Movieinfo.id} handleRateMovie={handleRateMovie} />

                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                        {/* // Now show streaming services */}
                        <br></br>
                        <Card key={Movieinfo.title} border='dark'>
                            <Card.Body>

                                < CardColumns >
                                    {MovieDetail.map((movie) => {
                                        return (
                                            <Card key={movie.id} border='dark'>
                                                <Card.Body>
                                                    <Card.Link href={movie.url} target="_blank">
                                                        <Card.Img src={movie.icon} className="streamSrc" alt={`the cover for ${movie.display_name}`} variant='top' />
                                                    </Card.Link>
                                                </Card.Body>
                                            </Card>)

                                    })}

                                </CardColumns >
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MovieDetails;
