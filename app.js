var express = require('express'),
  app = express(),
  browserify = require('browserify');

app.use(express.static(__dirname + '/public'));

app.get('/hookly.js', function(req,res){
  res.sendFile(__dirname + '/node_modules/hookly.js/hookly.min.js');	
});

app.get('/shortid.js', function(req,res){
  var b = browserify({
  	standalone: 'shortid'
  });
  b.add('./node_modules/shortid/index.js');
  b.bundle().pipe(res);
});

app.listen(3000, function(){
  console.log("Server running on 3000");
});

