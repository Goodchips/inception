
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	path = require('path');

var app = express();

// all environments
app.set('port', process.env.VCAP_APP_PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({	"secret": "sAZV6jE4mcvqUYQ5hVCjFNWxW3WF5WcDXPKnKC5NMHp6dbekyG", "store":  new express.session.MemoryStore({ reapInterval: 60000 * 10 }) }));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
	if (req.session.username) {
	    res.render('index');
    } else {
    	res.redirect("/login");
    }
});

var io = require('socket.io').listen(http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
}));

var users = [];

io.sockets.on('connection', function (socket) {
	socket.on('login',function(data){
		users.push(data);
		socket.emit('refreshUserList', users);
	});

    socket.emit('message', { message: 'welcome to the chat' });
    socket.emit('listUser', users);
    socket.on('send', function (data) {
    	console.log(data);
        io.socketsv.emit('message', data);
    });
    socket.on('refreshUserList', function(){
	    socket.emit('refreshUserList', users);
    });
    socket.on('disconnect', function(){
    	users.slice(users.indexOf(),1);
    	socket.broadcast.emit('refreshUserList', users);
    });
});