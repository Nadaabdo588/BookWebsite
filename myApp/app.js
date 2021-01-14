var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs= require('fs');
const session = require('express-session');
const { request } = require('http');
const { response } = require('express');
const { json } = require('body-parser');

var app = express();
app.use(session({secret:'illuminous',saveUninitialized:true, resave : true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const books = ['dune', 'flies','grapes','leaves','mockingbird','sun'];
const booknames = ['dune', 'lord of the flies', 'the grapes of wrath', 'leaves of grass', 'to kill a mockingbird', 'the sun and her flowers'];

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
  var data2 =fs.readFileSync('readList.json');
  if(data2.length==0)
    var readList = [];
  else
    var readList = JSON.parse(data2);
  readList.push({username: name, books:[]});
  fs.writeFileSync('readList.json',JSON.stringify(readList));
  
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
  res.render('dune',{err:""});
});
app.get('/flies', function(req,res){
  res.render('flies',{err:""});
});
app.get('/grapes', function(req,res){
  res.render('grapes',{err:""});
});
app.get('/leaves', function(req,res){
  res.render('leaves',{err:""});
});
app.get('/mockingbird', function(req,res){
  res.render('mockingbird',{err:""});
});
app.get('/sun', function(req,res){
  res.render('sun',{err:""});
});

//read list
app.get('/readlist',function(req,res){
  var data = fs.readFileSync('readList.json');
  if(data.length==0)
  {
    var readList=[];
  }else{
    var readList =JSON.parse(data);
  }
  for(var i =0;i<readList.length;i++)
  {
    var sess = req.session;
    var Uname = sess.username;
    if(readList[i].username==Uname)
      res.render('readlist',{books:readList[i].books});
  }

});

//searching results
app.post('/search',function(req, res){
  var ser = req.body.Search;
  ser = ser.toLowerCase();
  var b = [];
  for(var i=0 ;i<booknames.length;i++)
  {
    if(booknames[i].includes(ser))
      b.push(books[i]);
  }
  res.render('searchresults', {books:b});
  
});


app.post('/dune',function(req, res){
  addToReadList('dune',req,res);
});

app.post('/flies',function(req, res){
  addToReadList('flies',req,res);
});
app.post('/grapes',function(req, res){
  addToReadList('grapes',req,res);
});
app.post('/leaves',function(req, res){
  addToReadList('leaves',req,res);
});
app.post('/mockingbird',function(req, res){
  addToReadList('mockingbird',req,res);
});
app.post('/sun',function(req, res){
  addToReadList('sun',req,res);
});
function addToReadList (book,req,res){
  var data = fs.readFileSync('readList.json');
  if(data.length==0)
  {
    var readList=[];
  }else{
    var readList =JSON.parse(data);
  }
  for(var i =0;i<readList.length;i++)
  {
    var sess = req.session;
    var Uname = sess.username;
    var found=0;
    var addbook=0;
    if(readList[i].username==Uname)
      {
        var rl = readList[i].books;
        var found =0;
        for(var j=0;j<rl.length;j++)
        {
          if(rl[j]==book)
            {
              found=1;
              break;
            }
        }
        if(!found)
        {
          readList[i].books.push(book);
          addbook=1;
        }
      }
     
  }
  fs.writeFileSync('readList.json',JSON.stringify(readList));
  if(addbook)
  {
    res.render(book,{err:"Book is added successfully"});
  }else{
    res.render(book,{err:"Book already exists in your list"});
  }
  
}

// if(process.env.PORT){
//   app.listen(process.env.PORT,function(){console.log('Server started')});
//   }
//   else{
  app.listen(3000,function(){console.log('Server started on port 3000')});
 // }
  