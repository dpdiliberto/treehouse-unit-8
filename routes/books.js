var express = require('express');
var router = express.Router();

const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET articles listing. */
router.get('/books', asyncHandler(async (req, res) => {
  res.render("books");
}));

router.get('/new_book', asyncHandler(async (req, res) => {
  res.render("new_book");
}));

router.get('/book_detail', asyncHandler(async (req, res) => {
  res.render("book_detail");
}));

module.exports = router;