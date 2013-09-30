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
    'error': 'Basic usage: ' + req.protocol + '://' + req.get('host') + '/<instagram_username>. All optional media/recent parameters supported.'
  });
});

app.get('/:username', function(req, res) {
  var igUsername = req.params.username,
  igUserId;

  async.series([
    // find the user
    function(callback) {
      ig.user_search(igUsername, {count: 1}, function(err, users, limit) {
        if (err) {
          callback(true, { 'error': err });
          return;
        }

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

    // grab da images
    function(callback) {
      ig.user_media_recent(igUserId,
        req.query,
        function(err, media, pagination, limit) {
          if (err) {
            callback(true, { 'error': err });
            return;
          }

          if (pagination)
            callback(null, { 'media': media, 'next_max_id': pagination.next_max_id });
          else
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
