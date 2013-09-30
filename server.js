var express = require('express'),
ig = require('instagram-node').instagram(),
async = require('async');

var app = express();
app.use(express.logger());
app.use(express.bodyParser());
ig.use({
  access_token: process.env.INSTAGRAM_TOKEN
});

app.get('/', function(req, res) {
  res.json(400, {
    'error': 'Usage: ' + req.get('host') + '/<instagram_username>'
  });
});

app.get('/:username', function(req, res) {
  var igUsername = req.params.username,
  igUserId;

  async.series([
    // do search first
    function(callback) {
      ig.user_search(igUsername, {count: 1}, function(err, users, limit) {
        if (users.length > 0) {
          igUserId = users[0].id;
          callback();
        } else {
          callback(true, {
            'error': 'Couldn\'t find username "' + igUsername + '"'
          });
        }
      });
    },

    // get this user's last 20 images
    function(callback) {
      ig.user_media_recent(igUserId, {count: 20}, function(err, media, pagination, limit) {
        callback(null, { 'media': media });
      });
    }
  ],
  function(err, results) {
    var response = results.pop();
    if(response.hasOwnProperty('error')) {
      res.json(400, response);
    } else {
      res.json(response);
    }
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});