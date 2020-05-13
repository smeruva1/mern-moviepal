import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as API from '../utils/API';
import { Jumbotron, Container, Row, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';


function MovieDetails(props) {

    const { match: { params } } = props;

    const userData = useContext(UserInfoContext);

    //movie
    const [Movieinfo, setMovieinfo] = useState({});

    //utelly info 
    const [MovieDetail, setMovieDetail] = useState([]);
    //console.log(params.id);

    //    console.log(UserData.savedMovies);

    // let selectedMovie = userData.savedMovies.filter(movie => movie.id === params.id);
    // console.log(selectedMovie);

    useEffect(() => {

        API.searchMovieByID(params.id)
            .then(({ data }) => {
                //console.log(data);
            
        return setMovieinfo(data);
    })
        .catch((err) => console.log(err));

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
const Movierow = <table>
<tbody>
        <tr>
            <td>
                <img src={`http://image.tmdb.org/t/p/w185${Movieinfo.poster_path}`} alt={`the cover for ${Movieinfo.title}`} variant='top' />
            </td>
            <td className = "table-container">
            <strong>{Movieinfo.title}</strong> <br></br>
            {Movieinfo.overview}
            <h6 className='small'>Popularity: {Movieinfo.popularity}</h6>
            <h6 className='small'>Vote Average: {Movieinfo.vote_average}</h6>
            </td>
            
        </tr>
    </tbody>
    </table>


return (
    <>
    
        <Row>
            {/* <Col md={12} md={12}>
                

                <CardColumns className="singlecol">
                    <Card key={Movieinfo.id} border='dark'>
                        {Movieinfo.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${Movieinfo.poster_path}`} alt={`the cover for ${Movieinfo.title}`} variant='top' /> : null}
                        <Card.Body className = "card">
                            <Card.Title>{Movieinfo.title}</Card.Title>
                            <h6 className='small'>Popularity: {Movieinfo.popularity}</h6>
                            <h6 className='small'>Vote Average: {Movieinfo.vote_average}</h6>
                            <Card.Text>{Movieinfo.overview}</Card.Text> */}
                            {userData.username && (
                                <div>

                                    <Star rating={userData.savedMovies?.some((savMovie) => savMovie.id === Movieinfo.id) ?
                                        userData.savedMovies?.find((savMovie) => savMovie.id === Movieinfo.id).rating :
                                        Movieinfo.rating} id={Movieinfo.id} handleRateMovie={handleRateMovie} />

                                    {/* <Button
                                            disabled={userData.savedMovies?.some((savedMovie) => savedMovie.id === Movieinfo.id)}
                                            className='btn-block btn-info'
                                            onClick={() => handleSaveMovie(Movieinfo.id)}>
                                            {userData.savedMovies?.some((savedMovie) => savedMovie.id === Movieinfo.id)
                                                ? 'In Watchlist!'
                                                : 'Add to Watchlist!'}
                                        </Button> */}
                                </div>
                            )}
                        {/* </Card.Body>
                    </Card>

                </CardColumns>
            </Col> */}
            {Movierow}
            <Col xs={12} md={6}>
                < CardColumns >
                    {
                        MovieDetail.map((movie) => {
                            return (
                                <Card key={movie.id} border='dark'>
                                    <Card.Body>
                                        <Card.Link href={movie.url} target="_blank">
                                            {movie.icon ? <Card.Img src={movie.icon}
                                                className="streamSrc" alt={`the cover for ${movie.display_name}`} variant='top' /> : <Card.Img src=
                                                    'https://via.placeholder.com/150' className="streamSrc" alt={`the cover for ${movie.display_name}`} variant='top' />}
                                        </Card.Link>
                                    </Card.Body>
                                </Card>)
                        })
                    }
                </CardColumns >
                   
            </Col>
            
        </Row>
    </>
)
}

export default MovieDetails;