/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

const fs = require('fs');


var messages = [];
var messageCountId = 0;
  
var requestHandler = function(request, response) {



  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  

  var responseMessage = {results: []};

  var statusCode = 200;

  if (request.method === 'OPTIONS') {
    sendPage('application/json', 200, '');
  } else if (new RegExp('^/classes/messages.*').test(request.url)) { 

    //console.log('Serving request type ' + request.method + ' for url ' + request.url);
    if (request.method === 'GET') {
      sendPage(response, 'application/json', 200, JSON.stringify({results: messages}));
    } else if (request.method === 'POST') {

      var reqData = '';  
      request.on('data', function(data) {
        reqData += data;
      });
      request.on('end', function () {

        var post = JSON.parse(reqData);
        post.objectId = messageCountId++;

        messages.push(post);

        sendPage(response, 'application/json', 201, '');

      });
    }    
  } else if (new RegExp('^/client.*').test(request.url)) {
    var process = require('process');
    process.chdir('../client/client');

    fs.readFile('index.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      sendPage(response, 'text/html', 200, data);
    });



  } else {
    sendPage(response, 'application/json', 404, '');
  }

};
//JSON.stringify(responseMessage)

var sendPage = function(response, contentType, statusCode, text) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = contentType;
  response.writeHead(statusCode, headers);
  response.end(text);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
