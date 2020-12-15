var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs= require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('login',{err:0})
});

// login page
app.get('/registration', function(req,res){
res.render('registration' , {err:0});
});

app.post('/',function(req, res){
  var users =JSON.parse(fs.readFileSync('users.json'));
  var name = req.body.username;
  var pass = req.body.password;
  var found=0;
  for(var i=0;i<users.length;i++)
  {
    var user = users[i];
    if(name==user.username)
      {
        if(pass==user.password){
        found = 1;
        }
        else{
          found = 2;
        }
        
        break;
      }
  }
  if(found==1)
  {
    res.render('home',{err:0});
  }else if(found==0){
    res.render('login', {err:1});
  }
  else{
    res.render('login', {err:2});
  }
  });


// register page
app.post('/register',function(req, res){
var users =JSON.parse(fs.readFileSync('users.json'));
var name = req.body.username;
var pass = req.body.password;
var found=0;
if(pass==""){
  res.render('registration', {err:2});
  return;
}
for(var i=0;i<users.length;i++)
{
  var user = users[i];
  if(name==user.username)
    {
      found = 1;
      res.render('registration', {err:1});
      return;
    }
}
  users.push({username: name, password:pass});
  fs.writeFileSync('users.json',JSON.stringify(users));
  res.render('home');

});

// home page
app.get('/novel', function(req,res){
  res.render('novel');
});
app.get('/poetry', function(req,res){
  res.render('poetry');
});
app.get('/fiction', function(req,res){
  res.render('fiction');
});


// books
app.get('/dune', function(req,res){
  res.render('dune');
});
app.get('/flies', function(req,res){
  res.render('flies');
});
app.get('/grapes', function(req,res){
  res.render('grapes');
});
app.get('/leaves', function(req,res){
  res.render('leaves');
});
app.get('/mockingbird', function(req,res){
  res.render('mockingbird');
});
app.get('/sun', function(req,res){
  res.render('sun');
});







app.listen(3000);


