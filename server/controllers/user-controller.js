// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
const axios = require('axios');
require('dotenv').config();


module.exports = {

  // get all users
  async getAllUsers(req, res) {
    const users = await User.find();
    return res.json(users);
  },

  
  async getMovieDetails(req, res) {
  
    // async getMovieDetails({ user = null, params }, res) {
    //let movie = await User.savedMovies.findOne({id:req.params.id});

    //   id: { $in: params.users },
    //   "savedMovies.id": params.movieid
    // });

    // const userList = await User.find({
    //   _id: { $in: params.users.split(',') },
    //   "savedMovies.id": params.movieid
    // });

    // let movie = await Movie.findOne({id:req.params.id});
    console.log("inside controller");
    
    let utellydata = await axios.get(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?country=US&source=tmdb&
    source_id=481848`,{headers: {
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": "9e12b195f8msh211bda4699166cbp16fb57jsn1041353b0dde"
    
    //     let utellydata = await axios.get(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?country=US&source=tmdb&
    // source_id=481848${req.params.id}`,{headers: {
    //     "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
    //     "x-rapidapi-key": "9e12b195f8msh211bda4699166cbp16fb57jsn1041353b0dde"
        // "x-rapidapi-key": process.env.REACT_APP_UTELLY
        
    }})
    //console.log(movie);
    console.log(utellydata.data);
    // return res.json({movie, utellydata: utellydata.data});
    return res.json({utellydata: utellydata.data});
},

  // get a single user by either their id or their username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },


  // get a movie rating for a user
  async getMovieRating({ user = null, params }, res) {
    
    const userList = await User.find({
      _id: { $in: params.users.split(',') },
      "savedMovies.id": params.movieid
    });

    let totalRating = 0;

    userList.forEach(user => {
      user.savedMovies.forEach(movie => {
        if (movie.id === params.movieid) {
          totalRating += movie.rating;
        }
      }

      )
    })
    if (!userList) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

     res.json({ rating: userList.length > 0? totalRating / userList.length : 0 });
  },


  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' });
    }
    const token = signToken(user);
    res.json({ token, user });
  },



  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login({ body }, res) {
    const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' });
    }
    const token = signToken(user);
    res.json({ token, user });
  },



  // save a movie to a user's `savedMovies` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveMovie({ user, body }, res) {
    console.log(user);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedMovies: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },



  // remove a movie from `savedMovies`
  async deleteMovie({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedMovies: { id: params.id } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },
};
