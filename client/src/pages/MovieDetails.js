import React, { useState, useEffect, useContext } from 'react';
import * as API from '../utils/API';
import { Container, Row, Col, Card, CardColumns } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

import UserInfoContext from '../utils/UserInfoContext';
//import AuthService from '../utils/auth';

import amazonInstanceVideo from '../images/amazonInstanceVideo.PNG';
import amazonprimevideo from '../images/amazonprimevideo.jpg';
import appleTVPlus from '../images/appleTVPlus.PNG';
import atoms from '../images/atoms.png';
import cbs from '../images/cbs.PNG';
import disneyplus from '../images/disneyplus.jpg';
import googleplay from '../images/googleplay.jpg';
import hbo from '../images/hbo.PNG';
import hulu from '../images/hulu.PNG';
import iTunes from '../images/iTunes.PNG';
import netflix from '../images/netflix.png';
import YoutubePremium from '../images/YoutubePremium.PNG';


import MoviePosterPlaceHolder from '../images/MoviePosterPlaceHolder.png';
import Streamingplaceholder from '../images/Streamingplaceholder.PNG';


function MovieDetails(props) {

    const { match: { params } } = props;

    const userData = useContext(UserInfoContext);

    //movie
    const [Movieinfo, setMovieinfo] = useState({});

    //utelly info 
    const [MovieDetail, setMovieDetail] = useState([]);
    //console.log(params.id);

    //    console.log(UserData.savedMovies);


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

            <Container fluid="md">
                <Row>
                    <h1>Movie Details</h1>
                </Row>

                <Row>
                    <Col xs={12} md={6}>
                        <Card key={Movieinfo.id} style={{ width: '24rem' }} border='dark'>
                            {Movieinfo.poster_path ? <Card.Img src={`http://image.tmdb.org/t/p/w185${Movieinfo.poster_path}`} alt={`the cover for ${Movieinfo.title}`} variant='top' /> : <Card.Img src={MoviePosterPlaceHolder} alt={`the cover for ${Movieinfo.title}`} variant='top' />}
                        </Card>
                    </Col>


                    <Col xs={12} md={6}>
                        <Row>
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
                        </Row>
                        <br></br>

                        <Row>
                            {MovieDetail.map((movie) => {
                                return (
                                    <Col sm>
                                        <Card key={movie.id} style={{ width: '6rem', height: '6rem' }} border='dark'>

                                            <Card.Link href={movie.url} target="_blank">

                                                {movie.display_name === "Amazon Instant Video" ?
                                                    <Card.Img src={amazonInstanceVideo} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :


                                                    movie.display_name === "Amazon Prime Video" ?
                                                        <Card.Img src={amazonprimevideo} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                        movie.display_name === "Apple TV+" ?
                                                            <Card.Img src={appleTVPlus} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                            movie.display_name === "AtomTicketsIVAUS" ?
                                                                <Card.Img src={atoms} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                movie.display_name === "CBS" ?
                                                                    <Card.Img src={cbs} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                    movie.display_name === "Google Play" ?
                                                                        <Card.Img src={googleplay} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                        movie.display_name === "HBO" ?
                                                                            <Card.Img src={hbo} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :


                                                                            movie.display_name === "HULU" ?
                                                                                <Card.Img src={hulu} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                                movie.display_name === "iTunes" ?
                                                                                    <Card.Img src={iTunes} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                                    movie.display_name === "Disney+" ?
                                                                                        <Card.Img src={disneyplus} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                                        movie.display_name === "Netflix" ?
                                                                                            <Card.Img src={netflix} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :

                                                                                            movie.display_name === "YouTube Premium" ?
                                                                                                <Card.Img src={YoutubePremium} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' /> :



                                                                                                <Card.Img src={Streamingplaceholder} className="streamSrc" alt={`icon for ${movie.display_name}`} variant='top' />
                                                }

                                            </Card.Link>
                                        </Card>
                                        <Card.Text> {movie.display_name} </Card.Text>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}


export default MovieDetails;