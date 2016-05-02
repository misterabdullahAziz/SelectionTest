
var hit = function (url,callback){
  var options = {
  host: url,
  port: 80
  };
  var title;
  if(url.indexOf('.com') == -1)
    return callback(null,'No RESPONSE');
  var req = http.get(options, function(res) {
   
    var data ='';

    res.on('data', function(chunk) {
    data += chunk;
    })
    .on('error', function(err) {
        return callback(null,'No RESPONSE');
    })
    .on('end', function() {
        var cdata = data.toLowerCase();
        var a = cdata.indexOf('<title>');
        var b = cdata.indexOf('</title>');
        title = data.substring(a+7,b);
        return callback(null,title);
    })
    
  });
};

var express = require('express');
var app = express();
var Q = require('q');
var http = require('http');
var async = require('async');

app.get('/I/want/title/', function (req, res) {
    var addresses = req.query;
    var address = addresses.address;
    var promiseArray = [];
    if(typeof address == 'object')
    {
      address.forEach(function(ad,index){
          promiseArray.push(ad);
      })
    }
    else
      promiseArray.push(address);
    async.map(promiseArray, hit, function(error,results){
      res.write('<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>');
      results.forEach(function(t,index){
          if(t !== '' )
            res.write('<li>'+promiseArray[index]+ ' - "'+t+'"</li>');
          else
            res.write('<li>'+promiseArray[index]+ ' - NO RESPONSE</li>');
        });
      res.write('</ul></body></html>');
      res.end();

    });

});

app.get('*', function(req, res){
  res.status(404)        
   .send('Not found');
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
