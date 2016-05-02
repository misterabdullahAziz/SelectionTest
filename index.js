function hit(address, callback){
	var titles = [];
	address.forEach(function(a,index){
	var options = {
	  host: a,
	  port: 80
	  };
		var data ='';
		if(a.indexOf('.com') == -1){
			titles[index]=('No RESPONSE');
    	}
		else{
			var req = http.get(options, function(res)  {
		
				  res.on('data', function(chunk)  {
				  	data += chunk;
				  });
				  res.on('end', function () {
				  	var cdata = data.toLowerCase();
				  	var a = cdata.indexOf('<title>');
				  	var b = cdata.indexOf('</title>');
		
				  	titles[index]= (data.substring(a+7,b));
				    if(index == address.length-1)
				    	callback(titles);
				    
				  });
			});
		}
	});
}


var express = require('express');
var app = express();
var http = require('http');


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

	hit(promiseArray , function(titles){
	res.write('<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>');
	titles.forEach(function(t,index){
	if(typeof address == 'object'){
        if(t !== '' )
          res.write('<li>'+address[index]+ ' - "'+t+'"</li>');
        else
          res.write('<li>'+address[index]+ ' - NO RESPONSE</li>');
      }
    else{
        if(t !== '' )
          res.write('<li>'+address+ ' - "'+t+'"</li>');
        else
          res.write('<li>'+address+ ' - NO RESPONSE</li>');
      }
    if(index == titles.length-1)
	{
		res.write('</ul></body></html>');
		res.end();
	}  
    });
	
	});
});

app.get('*', function(req, res){
  res.status(404)      
   .send('Not found');
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});