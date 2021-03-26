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

  // Render the error page
  // 'page_not_found' if error is 404
  if (err.status == 404) {
    res.status(404);
    res.render('page-not-found', {title: err.message});
  } else {
    // 'error' if error is not 404
    err.message = err.message || 'Oops! Something went wrong.';
    res.status(err.status || 500);
    res.render('error', { err });
  }
  console.log('Global error handler called: ',  err.message);
});

// Iniitialize library's book data
(async () => {
  await db.Book.sync();
  try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = app;
