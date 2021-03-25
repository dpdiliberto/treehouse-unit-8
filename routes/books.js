const express = require('express');
const router = express.Router();

const db = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
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

/* Function to handle 404 error when a book does not exist */
function notFound() {
  const err = new Error();
  err.message = `The book you requested does not exist.`
  err.status = 404;
  throw err;
}

/* Get book listing, with all books listed in ascending order based on title. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["title", "ASC"]] } );
  res.render('index', {books: books, title: 'Library Book List'});
}));

/* Get new book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'Add a New Book'});
}));

/* Post request to create new book */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    // If an error is a Sequelize validation error, then show that validation message
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      console.log(book);
      res.render('new-book', { book, errors: error.errors, title: 'Add a New Book'} );
    } else {
      throw error;
    }
  }
}))

/* Get request based on search query */
router.get('/search', asyncHandler(async (req, res) => {
  const searchQuery = req.query.query.toLowerCase();
  /* Compares lower case query with lower case book title entry */
  const books = await Book.findAll({
    where: {
        title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + searchQuery + '%')
    },
    order: [["title", "ASC"]] 
  });
  console.log(books);
  res.render('index', {books: books, title: 'Library Book List'});
}));

/* Edit book form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', {book: book, title: 'Edit Book'});
  } else {
    notFound();
  }
}));

/* Post request to update a selected book's details */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    /* If specified book exists, update the book and redirect to the main books page */
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      notFound();
    }
  } catch(error) {
    /* Handle Seqelize validation errors */
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: 'Edit Book'})
    } else {
      throw error;
    }
  }
}));

/* Post request to delete selected book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  /* If specified book exists, deleted it and redirect to main books page */
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    notFound();
  }
}));

module.exports = router;