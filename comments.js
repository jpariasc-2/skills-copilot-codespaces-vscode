// Create web server

var express = require('express');
var router = express.Router();
var db = require('../models/db');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');

// Create session
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Create web server
router.get('/', function(req, res) {
  // If user is logged in, show comments page
  if (req.session.loggedin) {
    res.render('comments', {
      title: 'Comments',
      username: req.session.username,
      email: req.session.email,
      message: req.session.message
    });
  } else {
    // If user is not logged in, redirect to login page
    res.redirect('/login');
  }
});

// Add comment
router.post('/add', urlencodedParser, function(req, res) {
  var comment = req.body.comment;
  var username = req.session.username;
  var email = req.session.email;
  var message = '';

  // Check if comment is empty
  if (comment == '') {
    message = 'Comment cannot be empty!';
    res.render('comments', {
      title: 'Comments',
      username: username,
      email: email,
      message: message
    });
  } else {
    // Check if comment already exists
    db.query('SELECT * FROM comments WHERE comment = ?', [comment], function(error, results, fields) {
      if (results.length > 0) {
        message = 'Comment already exists!';
        res.render('comments', {
          title: 'Comments',
          username: username,
          email: email,
          message: message
        });
      } else {
        // Add comment to database
        db.query('INSERT INTO comments SET ?', {comment: comment}, function(error, results, fields) {
          if (error) {
            message = 'Error adding comment!';
            res.render('comments', {
              title: 'Comments',
              username: username,
              email: email,
              message: message
            });
          } else {
            message = 'Comment added!';
            res.render('comments', {
              title: 'Comments',
              username: username,
              email: email,
              message: message
            });
          }
        });
      }
    });
  }
});

// Delete comment
router.post('/delete', url