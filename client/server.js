var connect = require('connect');
var serveStatic = require('serve-static');
console.log (process.env);
connect().use(serveStatic(__dirname+"/public")).listen((process.env.PORT, function(){
    console.log('Server running on' + process.env.PORT);
});
