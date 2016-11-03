var connect = require('connect');
var serveStatic = require('serve-static');
console.log(process.env);
connect().use(serveStatic(__dirname+"/public")).listen(5000, function(){
    console.log('Server running on' + 5000);
});
