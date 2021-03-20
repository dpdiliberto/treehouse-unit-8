const express = require('express');
const router = express.Router();

const db = require('../models');
const Book = db.Book;

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

function notFound() {
  const err = new Error();
  err.message = `The book you requested does not exist.`
  err.status = 404;
  throw err;
}

/* GET articles listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll( { order: [["title", "ASC"]] } );
  console.log(books);
  res.render('books', {books: books});
}));

/* Get new book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('book_form', { book: {}});
}));

/* POST create new book */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      console.log(book);
      res.render('book_form', { book, errors: error.errors} );
    } else {
      throw error;
    }
  }
}))

/* Edit book form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("book_detail", {book: book});
  } else {
    notFound();
  }
}));

/* Update a book */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      notFound();
    }
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('book_detail', {book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));

/* Update a book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    notFound();
  }
}));

module.exports = router;