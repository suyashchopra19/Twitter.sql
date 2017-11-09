'use strict';
var express = require('express');
var router = express.Router();
var client = require('../db/')
// var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query(`SELECT content , users.name , users.picture_url 
      FROM tweets 
      INNER JOIN users 
      ON users.id  = tweets.user_id `, function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    // var picture_url = result.rows
    console.log(tweets)
    // console.log(picture_url)
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true, picture_url:tweets.picture_url });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    var username = req.params.username;
    console.log(username)
    client.query(`SELECT users.name, content , users.picture_url 
      FROM tweets 
      INNER JOIN users 
      ON users.id  = tweets.user_id 
      WHERE name=$1`, ['username'], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    // var picture_url = result.rows
    console.log(tweets)
    // console.log(picture_url)
    res.render('index', { title: 'Twitter.js', username:username, showForm: true, picture_url:tweets.picture_url });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsWithThatId // an array of only one element ;-)
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    var newTweet = tweetBank.add(req.body.name, req.body.text);
    io.sockets.emit('new_tweet', newTweet);
    res.redirect('/');
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
