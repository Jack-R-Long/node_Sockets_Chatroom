// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var session = require('express-session');
var app = express();
// more new code:
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// Get sockets 
const server = app.listen(8000);
const io = require('socket.io')(server);
var counter = 0;
var users = []

io.on('connection', function (socket) { //2
	  //Insert SOCKETS 
	  socket.on('posting_form', function(data){
		  users.push(data)
		  console.log(users)
		  session.name = data.name
		  console.log(session.name)
		  socket.emit('form_recieved', data)
	  })
});

// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})
// post route for adding a user
app.post('/users', function(req, res) {
 console.log("POST DATA", req.body);
 // This is where we would add the user to the database
 // Then redirect to the root route
 res.redirect('/');
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(request, response){
	response.send("404")
});

// tell the express app to listen on port 8000
//app.listen(8000, function() {
 //console.log("listening on port 8000");
//});