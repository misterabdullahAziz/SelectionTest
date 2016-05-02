var express = require('express');
var app = express();
var Q = require('q');
var http = require('http');

app.get('/I/want/title/', function (req, res) {

var addresses = req.query;
var address = addresses.address;
var promiseArray = [];
if(typeof address == 'object')
{
  address.forEach(function(ad){
    promiseArray.push(hit(ad));
  })
}
else
  promiseArray.push(hit(address));
var Promise = Q.all(promiseArray);
Promise.then(function (results) { 
  res.write('<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>');
  results.forEach(function(t,index){
      if(t !== '' )
        res.write('<li>'+address[index]+ ' - "'+t+'"</li>');
      else
        res.write('<li>'+address[index]+ ' - NO RESPONSE</li>');
    })
  res.write('</ul></body></html>');
  res.end();
}, console.error);

});
app.get('*', function(req, res){
  res.status(404)        
   .send('Not found');
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});

function hit (url){
  var deferred = Q.defer();
  var options = {
  host: url,
  port: 80
  };
  var title;
  if(url.indexOf('.com') == -1){
    deferred.resolve('NO RESPONSE');
   return deferred.promise;
 } 
 var req = http.get(options, function(res) {
   
    var data ='';
    res.on('data', function(chunk) {
    data += chunk;
    })
    .on('end', function() {
        var cdata = data.toLowerCase();
        var a = cdata.indexOf('<title>');
        var b = cdata.indexOf('</title>');

        title = data.substring(a+7,b);
        deferred.resolve(title);
    })
  });
return deferred.promise;
}


