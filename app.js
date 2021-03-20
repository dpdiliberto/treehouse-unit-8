var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const books = require('./routes/books');
const routes = require('./routes/index');

var app = express();

const db = require('./models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.message = 'Page not found!';
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if (err.status == 404) {
    res.status(404);
    res.render('page_not_found', {err});
  } else {
    err.message = err.message || 'Oops! Something went wrong.';
    res.status(err.status || 500);
    res.render('error', { err });
  }
  console.log('Global error handler called: ',  err.message);
});

(async () => {
  await db.sequelize.sync({ force: true });
  try {
    console.log('Connection has been established successfully.');
    const booksInstances = await Promise.all([
      db.Book.create({
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        genre: 'Non Fiction',
        year: 1988,
      }),
      db.Book.create({
        title: 'Armada',
        author: 'Ernest Cline',
        genre: 'Science Fiction',
        year: 2015
      }),
      db.Book.create({
        title: 'Emma',
        author: 'Jane Austen',
        genre: 'Classic',
        year: 1815
      }),
      db.Book.create({
        title: 'Frankenstein',
        author: 'Mary Shelley',
        genre: 'Horror',
        year: 1818
      }),
      db.Book.create({
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1998
      }),
      db.Book.create({
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Classic',
        year: 1813
      }),
      db.Book.create({
        title: 'Ready Player One',
        author: 'Ernest Cline',
        genre: 'Science Fiction',
        year: 2011
      }),
      db.Book.create({
        title: 'The Martian',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        year: 2014
      }),
      db.Book.create({
        title: 'The Universe in a Nutshell',
        author: 'Stephen Hawking',
        genre: 'Non Fiction',
        year: 2001
     }),
    ]);

  const booksJSON = booksInstances.map(book => book.toJSON());
  console.log(booksInstances);

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = app;
