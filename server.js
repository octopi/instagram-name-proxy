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
  igMaxId = req.query.max_id,
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
        {count: 20, max_id: igMaxId},
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