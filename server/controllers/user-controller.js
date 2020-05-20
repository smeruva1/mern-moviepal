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
    // console.log("line 35 going to print");
    // console.log(params);

    const userList = await User.find({
      _id: { $in: params.users.split(',') },
      "savedMovies.id": params.movieid
    });
    // console.log("line 42 going to print");
    // console.log(userList);

    let totalRating = 0;

    userList.forEach(user => {
      user.savedMovies.forEach(movie => {
        // console.log("line 49 going to print");
        // console.log(movie);
        if (movie.id == params.movieid) {
          // console.log("Hi");
          // console.log(movie.id, params.movieid);
          totalRating += movie.rating;
        }
      }

      )

    })
    // console.log(totalRating);

    if (!userList) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    // console.log({ rating: userList.length > 0? totalRating / userList.length : 0 });

    res.json({ rating: userList.length > 0 ? totalRating / userList.length : 0 });
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
    // console.log("Inside user controller js file Savemovie function, to update user db doc") ;
    // console.log(user);
    // console.log(body);

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedMovies: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      //console.log(err);
      return res.status(400).json(err);
    }
  },

  // save a family to a user's `savedFamily` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveFamily({ user, body }, res) {
    // console.log("Inside user controller js file Savefamily function, to update user db doc") ;
    // console.log(user);
    // console.log(body);
    // console.log(JSON.stringify(body.id));

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $addToSet: { family: body.id },
          $pull: { friends: body.id }
        },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      //console.log(err);
      return res.status(400).json(err);
    }
  },

  // save a family to a user's `savedFamily` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveFriend({ user, body }, res) {
    // console.log(user);
    // console.log(body);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $addToSet: { friends: body.id },
          $pull: { family: body.id }
        },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      //console.log(err);
      return res.status(400).json(err);
    }
  },

  // delete family and friend for a user
  // user comes from `req.user` created in the auth middleware function
  async deleteFamilyAndFriend({ user, body }, res) {
    // console.log("Hi from deleteF&F");
    // console.log(user);
    // console.log(body);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $pull: { family: body.id, friends: body.id }
        },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      //console.log(err);
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
