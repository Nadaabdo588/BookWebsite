var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs= require('fs');
const session = require('express-session');

var app = express();
app.use(session({secret:'illuminous',saveUninitialized:true, resave : true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const books = ['dune', 'flies','grapes','leaves','mockingbird','sun'];
const booknames = ['Dune', 'Lord of the Flies', 'The Grapes of Wrath', 'Leaves of Grass', 'To Kill a Mockingbird', 'The Sun and Her Flowers'];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('login',{err:""})
});

// login page
app.get('/registration', function(req,res){
res.render('registration' , {err:""});
});

app.post('/',function(req, res){
  var data=fs.readFileSync('users.json')
  if(data.length==0)
  {
    var users=[];
  }else{
    var users =JSON.parse(data);
  }
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
    var sess = req.session;
    sess.username = name;
    res.render('home',{err:"welcome "+sess.username});
  }else if(found==0){
    res.render('login', {err:"Username does not exist"});
  }
  else{
    res.render('login', {err:"Password is incorrect"});
  }
  });


// register page
app.post('/register',function(req, res){
var data=fs.readFileSync('users.json');
if(data.length==0){
  var users=[];}
else{
  var users =JSON.parse(data);
}
var name = req.body.username;
var pass = req.body.password;
var found=0;
if(name=="")
{
  res.render('registration', {err:"Please enter a valid username "});
  return;
} 
if(pass==""){
  res.render('registration', {err:"Please enter a password "});
  return;
}
for(var i=0;i<users.length;i++)
{
  var user = users[i];
  if(name==user.username)
    {
      found = 1;
      res.render('registration', {err:"Username already exists"});
      return;
    }
}
  users.push({username: name, password:pass});
  fs.writeFileSync('users.json',JSON.stringify(users));
  var sess = req.session;
  sess.username = name;
  res.render('home', {err: ''});

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

//read list
app.get('/readlist',function(req,res){
  res.render('readlist');

});

//searching results
app.post('/search',function(req, res){
  res.render('searchresults', {books:books, names :booknames});
});





app.listen(3000);

