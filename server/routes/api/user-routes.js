const router = require('express').Router();
const {
  createUser,
  getAllUsers,
  getSingleUser,
  saveMovie,
  deleteMovie,
  login,
  getMovieRating,
  getMovieDetails,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').get(getAllUsers).post(createUser).put(authMiddleware, saveMovie);

router.route('/movies/:movieid/:users').get(getMovieRating)

router.route('/login').post(login);

router.route('/me').get(authMiddleware, getSingleUser);

router.route('/:username').get(getSingleUser);

router.route('/movies/:id').delete(authMiddleware, deleteMovie);

router.get('/details/:id',getMovieDetails);

module.exports = router;
