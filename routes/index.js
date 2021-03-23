const express = require('express');
const router = express.Router();

/* Redirect to home page /books. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

module.exports = router;