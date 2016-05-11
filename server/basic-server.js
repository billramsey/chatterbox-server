  var express = require('express');
  var fs = require('fs');

  var storageFileName = 'oneBigDocument.txt';

  try {
    var fileContents = fs.readFileSync(storageFileName, 'utf8');
    console.log('reading from file', fileContents);
    var messages = JSON.parse(fileContents);
  } catch (e) {
    var messages = [];
  }

  var messageCountId = 0;

  var app = express();
  //console.log('dirname', __dirname);
  app.use('/static', express.static(__dirname + '/../client/')); //__dirname + 


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

      fs.writeFile(storageFileName, JSON.stringify(messages), 'utf8', function(err) {
        console.log('finished writing');
      });

      res.status(201).send();
    });
  })
  .options(function(req, res) {
    res.status(200).send();
  });

  app.listen(3000, function() {
  });
