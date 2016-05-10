var express = require('express');
//var cors = require('cors');

var messages = [];
var messageCountId = 0;

var app = express();

app.use('/static', express.static('../client/client')); //__dirname + 

app.route('/classes/messages')
.all(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key');
  res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('access-control-max-age', '10');
  next();
})
.get(function (req, res) {
  
  res.set('Content-Type', 'application/JSON');
  res.status(200).send(JSON.stringify({results: messages}));
})
.post(function (req, res) {
  var reqData = '';  
  req.on('data', function(data) {
    reqData += data;
  });

  req.on('end', function () {
    var post = JSON.parse(reqData);
    post.objectId = messageCountId++;
    messages.push(post);
    res.status(201).send();
  });
});

app.listen(3000, function() {
});