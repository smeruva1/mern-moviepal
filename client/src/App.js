import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchMovies from './pages/SearchMovies';
import SavedMovies from './pages/SavedMovies';
import HomeMovies from './pages/HomeMovies';
import NewMovies from './pages/NewMovies';
import PopularMovies from './pages/PopularMovies';
import TopRatedMovies from './pages/TopRatedMovies';
import TVShows from './pages/TVShows';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import * as API from './utils/API';
import AuthService from './utils/auth';

// import our context object for state
import UserInfoContext from './utils/UserInfoContext';

function App() {
  // set data to be used for UserInfoContext and make it available to all other components
  const [userInfo, setUserInfo] = useState({
    savedMovies: [],
    friends: [],
    family: [],
    username: '',
    email: '',
    movieCount: 0,

    // method to get user data after logging in
    getUserData: () => {
      // if user's logged in get the token or return null
      const token = AuthService.loggedIn() ? AuthService.getToken() : null;

      if (!token) {
        return false;
      }
      API.getMe(token)
        .then(({ data: { username, email, savedMovies, friends, family, movieCount } }) => {

          setUserInfo({ ...userInfo, username, email, savedMovies, friends, family, movieCount });

          // return { username, email, savedMovies, friends, family, movieCount};
        }
        )
        // .then(async ({ username, email, savedMovies, friends, family, movieCount }) => {

        //   await savedMovies.forEach(async movie => {

        //     if (friends.length > 0) {
        //       await API.getMovieRating(movie.id, friends, token)
        //         .then(({ data }) => {
        //           movie.friendRating = data.rating;
        //         })
        //         .catch((err) => console.log(err));
        //     }

        //     if (family.length > 0) {
        //       await API.getMovieRating(movie.id, family, token)
        //         .then(({ data }) => {
        //           movie.familyRating = data.rating;
        //         })
        //         .catch((err) => console.log(err));
        //     }
        //   })

        //   //setUserInfo({username, email, savedMovies, friends, family, movieCount })
        //   setUserInfo({ ...userInfo, username, email, savedMovies, friends, family, movieCount });
        // }
        // )
        .catch((err) => console.log(err));
    },
  });

  // on load, get user data if a token exists
  useEffect(() => {
    userInfo.getUserData();
  }, []);

  return (
    <Router>
      <>
        {/* wrap our entire app in context provider and provide userInfo state as value */}
        <UserInfoContext.Provider value={userInfo}>
          <Navbar />
          <Switch>
            <Route exact path='/search' component={SearchMovies} />
            <Route exact path='/' component={HomeMovies} />
            <Route exact path='/new' component={NewMovies} />
            <Route exact path='/popular' component={PopularMovies} />
            <Route exact path='/toprated' component={TopRatedMovies} />
            <Route exact path='/tvshows' component={TVShows} />
            <Route exact path='/saved' component={SavedMovies} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </UserInfoContext.Provider>
      </>
      <Footer />
    </Router>
  );
}

export default App;
