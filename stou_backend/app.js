var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var Map = require('Map');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors =  require('cors');
var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', function (req,res) {
  res.send('testing');
});

let loginTokens = {};
let revLoginTokens = {};

const uuidv4 = require('uuid/v4');


const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const userConfig = {
  server: 'stoudb.database.windows.net',  //update me
  authentication: {
    type: 'default',
    options: {
      userName: 'stou-admin', //update me
      password: 'Purduepete1!'  //update me
    }
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: 'user-info'  //update me
  }
};

const foodConfig = {
  server: 'stoudb.database.windows.net',  //update me
  authentication: {
    type: 'default',
    options: {
      userName: 'stou-admin', //update me
      password: 'Purduepete1!'  //update me
    }
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: 'food-info'  //update me
  }
};

const userConnection = new Connection(userConfig);
const foodConnection = new Connection(foodConfig);

userConnection.on('connect', function(err) {
  // If no error, then good to proceed.
  console.log("Connected");
});


app.use('/setlocation', function(req, res, next){
  const email = req.param('email');
  const location = req.param('location');
  var o = {};
  const request = new Request('update Location=\'' + location + '\' where Email=\''+email+'\'', function (err, rowCount, rows) {
    if(parseInt(rowCount.toString()) === 0) {
      o['code'] = 400;
      res.status(400)
      o['message'] = 'Invalid customer';
      res.send(o);
    } else {
      o['code'] = 200;
      res.status(200);
      o['message'] = 'Location updated';
      res.send(o);
    }
  });
  userConnection.execSql(request);
});

app.use('/logout', function(req, res, next){
  const token = req.param('token');
  delete revLoginTokens[loginTokens[token]];
  delete loginTokens[token];
  res.status(200);
  res.send({'code': '200', 'message': 'Logout successful'});
});


app.use('/getallfood', function(req, res, next){
  let o = {};
  const request = new Request('select * from FoodItems', function (err, rowCount, rows) {
    if(parseInt(rowCount.toString()) === 0) {
      o['code'] = 400;
      res.status(400)
      o['message'] = 'No food offered right now';
      res.send(o);
    }
  });
  let obj = [];
  let ob = {};
  request.on('row', function(columns){
    columns.forEach(function(column){
      if (column.metadata.colName === 'ItemName'){
        ob['name'] = column.value;
      } else if(column.metadata.colName === 'Homecook') {
        ob['homecook'] = column.value;
      } else if(column.metadata.colName === 'Price') {
        ob['price'] = column.value;
      } else if(column.metadata.colName === 'Allergens') {
        ob['allergens'] = column.value;
      } else if(column.metadata.colName === 'Cuisine') {
        ob['cuisine'] = column.value;
      } else if(column.metadata.colName === 'Calories') {
        ob['calories'] = column.value;
      } else if(column.metadata.colName === 'Picture') {
        ob['picture'] = column.value;
      }
    });
    obj.push(JSON.parse(JSON.stringify(ob)));
  });

  request.on('doneInProc', function (err) {
    o['data'] = obj;
    console.log(o);
    if(obj.length !== 0)
      res.send(o);
  });
  foodConnection.execSql(request);
});

app.use('/getfooditems', function(req,res,next){
  const email = req.param('email');
  let o = {};
  console.log('select * from FoodItems where Homecook=\''+email+'\'')
  const request = new Request('select * from FoodItems where Homecook=\'' + email + '\'', function (err, rowCount, rows) {
    if(parseInt(rowCount.toString()) === 0) {
      o['code'] = 400;
      res.status(400)
      o['message'] = 'No food offered by the homecook';
      res.send(o);
    }
  });
  let obj = [];
  let ob = {};
  request.on('row', function(columns){
    columns.forEach(function(column){
      if (column.metadata.colName === 'ItemName'){
        ob['name'] = column.value;
      } else if(column.metadata.colName === 'Homecook') {
        ob['homecook'] = column.value;
      } else if(column.metadata.colName === 'Price') {
        ob['price'] = column.value;
      } else if(column.metadata.colName === 'Allergens') {
        ob['allergens'] = column.value;
      } else if(column.metadata.colName === 'Cuisine') {
        ob['cuisine'] = column.value;
      } else if(column.metadata.colName === 'Calories') {
        ob['calories'] = column.value;
      } else if(column.metadata.colName === 'Picture') {
        ob['picture'] = column.value;
      }
    });
    obj.push(JSON.parse(JSON.stringify(ob)));
  });

  request.on('doneInProc', function (err) {
    o['data'] = obj;
    console.log(o);
    if(obj.length !== 0)
    res.send(o);
  });
  foodConnection.execSql(request);
});


app.use('/gethomecooks', function(req,res,next){
  const location = req.param('location');
  let o = {};
  const request = new Request('select * from Users where Location BETWEEN ' + (parseInt(location.toString()) - 2) + ' AND ' + (parseInt(location.toString()) +2) +'', function (err, rowCount, rows) {
  if(parseInt(rowCount.toString()) === 0) {
    o['code'] = 400;
    res.status(400)
    o['message'] = 'No homecooks in the area';
    res.send(o);
  }
  });
  let obj = [];
  let ob = {};
  request.on('row', function(columns){
    columns.forEach(function(column){
      if (column.metadata.colName === 'FirstName'){
        ob['name'] = column.value;
      } else if(column.metadata.colName === 'LastName') {
        ob['name'] = ob['name'] + ' ' + column.value;
      } else if(column.metadata.colName === 'Cuisines') {
        ob['cuisines'] = column.value;
      } else if(column.metadata.colName === 'Email') {
        ob['email'] = column.value;
      } else if(column.metadata.colName === 'ProfilePicture') {
        ob['profilePicture'] = column.value;
      }
    });
    obj.push(JSON.parse(JSON.stringify(ob)));
    ob['name'] = '';
  });

  request.on('doneInProc', function (err) {
    o['data'] = obj;
    console.log(o);
    if(obj.length !== 0)
    res.send(o);
  });
  userConnection.execSql(request);
});


app.use('/addfooditem', function(req, res, next){
  const itemName = req.body['data']['itemName'];
  const token = req.body['data']['token'];
  const location = req.body['data']['location'];
  const price = req.body['data']['price'];
  const allergens = req.body['data']['allergens'];
  const cuisine = req.body['data']['cuisine'];
  const calories = req.body['data']['calories'];
  const picture = req.body['data']['picture'];
  const desc = req.body['data']['description'];
  let o ={};
  console.log(token)
  console.log('insert into FoodItems values(\'' + itemName + '\', \'' + loginTokens[token] + '\', \'' + location + '\', \'' + price + '\', \'' + allergens +'\', \'' + cuisine + '\', \'' + calories +'\', \'' + picture + '\', \'' + desc + '\')')
  let request = new Request('insert into FoodItems values(\'' + itemName + '\', \'' + loginTokens[token] + '\', \'' + location + '\', \'' + price + '\', \'' + allergens +'\', \'' + cuisine + '\', \'' + calories +'\', \'' + desc + '\')', function (err, rowCount, rows) {
    if(err) {
      console.log(err);
      o['code'] = 400;
      res.status(400)
      o['message'] = 'Failed to add dish';
      res.send(o);
    } else {
      o['code'] = 200;
      res.status(200)
      o['message'] = 'Successfully added dish';
      res.send(o);
    }
  });
  foodConnection.execSql(request)
});




app.use('/editProfile', function(req,res,next){
  const email = req.param('email');
  const aboutMe = req.param('aboutMe');
  const name = req.param('name');
  const profilePicture = req.param('profilePicture');

  let o = {};
  console.log(profilePicture)
  let request = new Request('update Users set AboutMe=\'' + aboutMe + '\', FirstName=\'' + name.toString().split(' ')[0] +'\', LastName=\'' + name.toString().split(' ')[1] + '\' , ProfilePicture=\''+profilePicture+'\' where Email=\'' + email +'\'', function(err, rowCount, rows){
    if(err || rowCount === 0) {
      o['code'] = 400;
      res.status(400)
      o['message'] = 'Update failed';
      console.log(err)
      res.send(o);
    } else {
      o['code'] = 200;
      res.status(200)
      o['message'] = 'Successfully updated';
      res.send(o);
    }
  });
  userConnection.execSql(request);
});

app.use('/profile', function(req, res, next) {
  const email = req.param('email');
  const role = req.param('role');
  let o = {};
  let request = new Request('select * from Users where Email=\'' + email + '\' AND Role=\'' + role + '\'', function (err, rowCount, rows) {
    if (parseInt(rowCount.toString()) === 0 || err) {
      o['code'] = 404;
      res.status(404);
      o['message'] = 'User not found';
      res.send(o);
    }
  });
  request.on('row', function (columns) {
    o['code'] = 200;
    res.status(200);
    o['message'] = 'Success';
    columns.forEach(function (column) {
      if (column.metadata.colName === 'FirstName') {
        o['name'] = column.value;
      } else if (column.metadata.colName === 'LastName') {
        o['name'] = o['name']+' '+column.value;
      } else if (column.metadata.colName === 'AboutMe') {
        o['aboutMe'] = column.value;
      } else if(column.metadata.colName === 'Cuisines') {
        if(column.value == null){
          column.value = 'None'
        }
        o['cuisines'] = column.value;
      } else if(column.metadata.colName === 'ProfilePicture') {
        o['profilePicture'] = column.value
      }
    });
  });

  request.on('doneInProc', function(err){
    console.log(o);
    if(o['code'] !== 404)
    res.send(o);
  });

  userConnection.execSql(request)
});

app.use('/filter', function(req, res, next){
  const json = req.body['data'];
  const cuisines = json['cuisines'];
  const allergenList = json['allergens']
  const location = parseInt(json['location'].toString())
  var o = {};
  console.log(cuisines+"  "+allergenList)
  console.log('select * from FoodItems where Cuisine like \'' + cuisines + '\' AND Allergens NOT LIKE \''+ allergenList+'\' AND Location BETWEEN \''+ (location-2) +'\' AND \'' + (location+2) +'\'');
  const request = new Request('select * from FoodItems where Cuisine like \'' + cuisines + '\' AND Allergens NOT LIKE \''+ allergenList+'\' AND Location BETWEEN \''+ (location-2) +'\' AND \'' + (location+2) +'\'', function(err, rowCount, rows){
    if(parseInt(rowCount.toString()) === 0) {
      o['code'] = 400;
      res.status(400)
      o['message'] = 'No food items available';
      console.log(err)
      res.send(o);
    }
  });
  let obj = [];
  let ob = {};
  request.on('row', function(columns){
    columns.forEach(function(column){
      if (column.metadata.colName === 'ItemName'){
        ob['name'] = column.value;
      } else if(column.metadata.colName === 'Homecook') {
        ob['homecook'] = column.value;
      } else if(column.metadata.colName === 'Price') {
        ob['price'] = column.value;
      } else if(column.metadata.colName === 'Allergens') {
        ob['allergens'] = column.value;
      } else if(column.metadata.colName === 'Cuisine') {
        ob['cuisine'] = column.value;
      } else if(column.metadata.colName === 'Calories') {
        ob['calories'] = column.value;
      } else if(column.metadata.colName === 'Picture') {
        ob['picture'] = column.value;
      }
    });
    obj.push(JSON.parse(JSON.stringify(ob)));
  });

  request.on('doneInProc', function (err) {
    o['data'] = obj;
    console.log(o);
    res.status(200)
    if(obj.length !== 0)
      res.send(o);
  });
  foodConnection.execSql(request);

});

app.use('/forgotpassword', function(req, res, next){
  const encEmail = req.body['data']['encEmail'];
  const email = req.body['data']['email'];
  const encPassword = req.body['data']['encPassword'];
  const password = req.body['data']['password'];

  var o = {};
  console.log('update Users set Password=\'' + encPassword + '\' where Email=\'' + encEmail +'\'')
  const request = new Request(
      'update Users set Password=\'' + encPassword + '\' where Email=\'' + encEmail +'\'', function(err, rowCount, rows){
        if(parseInt(rowCount.toString()) === 1) {
          sendEmail(email, password, 'Here\'s your new password: ' + password);
          o['code'] = 200;
          res.status(200)
          o['message'] = 'Password et successfully';
          res.send(o);
        } else {
          o['code'] = 404;
          res.status(404)
          o['message'] = 'Reset failed';
          res.send(o);
        }
      });
  userConnection.execSql(request);
});

function sendEmail(email, password, text){
  const nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'markvadesamuel1998@gmail.com',
      pass: 'soccermanager'
    }
  });

  var mailOptions = {
    from: 'markvadesamuel1998@gmail.com',
    to: email.toString(),
    subject: 'Password reset',
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
app.use('/resetpassword', function(req, res, next) {
  const email = req.param['data']['email'];
  const oldPw = req.param['data']['oldPw'];
  const newPw = req.param['data']['newPw'];
  var  o = {};
  console.log('update Users set Password=\'' + newPw + '\' where Email=\'' + email + '\' AND Password=\'' + oldPw + '\'')
  const request = new Request(
      'update Users set Password=\'' + newPw + '\' where Email=\'' + email + '\' AND Password=\'' + oldPw + '\'', function(err, rowCount, rows){
        if(parseInt(rowCount.toString()) === 1) {
          o['code'] = 200;
          res.status(200)
          o['message'] = 'Password reset successfully';
          res.send(o);
        } else {
          o['code'] = 400;
          res.status(400);
          o['message'] = 'Reset failed';
          res.send(o);
        }
      });
  userConnection.execSql(request);
});


app.use('/login', function(req, res, next){
  const email = req.body['data']['email'];
  const password = req.body['data']['password'];
  const role = req.body['data']['role'];
  var o = {};
  console.log('select * from Users where Email=\'' + email + '\' AND Password=\'' + password + '\' AND Role=\'' + role + '\'')
  let request = new Request('select * from Users where Email=\'' + email + '\' AND Password=\'' + password + '\' AND Role=\'' + role + '\'', function(err, rowCount, rows){
    if(parseInt(rowCount.toString()) === 0) {
      o['code'] = 400;
      o['message'] = 'Invalid login credentials';
      res.status(400);
      console.log(o);
      res.send(o);
    } else {
      o['code'] = 200;
      o['message'] = 'Login successful';
      o['token'] = uuidv4();
      loginTokens[o['token']] = email;
      revLoginTokens[email] = o['token'];

      console.log(loginTokens);
      res.status(200);
      res.send(o);
    }
  });
  userConnection.execSql(request)
});



app.use('/register', function(req,res,next){
  const firstName = req.body['data']['firstName'];
  const lastName = req.body['data']['lastName'];
  const email = req.body['data']['email'];
  const password = req.body['data']['password'];
  const role = req.body['data']['role'];
  const cuisines = 'None';

  let o = {};
  console.log('select * from Users where Email=\'' + email +'\' AND Role=\'' + role + '\'');
  const request = new Request('select * from Users where Email=\'' + email +'\' AND Role=\'' + role + '\'', function(err, rowCount, rows) {
    if (err) {
      console.log(err);
      o['code'] = 400;
      o['message'] = 'Error occurred';
      res.status(400)
      res.send(o);
    }
    else if(rowCount !== 0) {
      o['code'] = 400;
      res.status(400);
      o['message'] = 'User already registered';
      res.send(o);
    } else if (!err) {
      console.log('allowing');
      registerUser(firstName, lastName, email, password, role, cuisines);
      o['code'] = 200;
      res.status(200);
      o['message'] = 'User registered successfully';
      o['token'] = uuidv4();
      loginTokens[o['token']] = email;
      revLoginTokens[email] = o['token'];

      res.send(o);
    }
  });
  userConnection.execSql(request);
});

function registerUser(firstName, lastName, email, password, role, cuisines) {
  const request = new Request('insert into Users values(\'' + firstName +'\', \'' + lastName + '\', \'' + email + '\', \'' + password + '\', \'' + role + '\', \'' +cuisines+'\', \'\', \'\', \'\')', function (err, rowCount, rows) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('success');
      let s = 'Privacy Policy\n' +
          '\n' +
          'Stou values the privacy of the users who use our web service. And, we want you to be aware\n' +
          'of how we collect, use, share information of the users. This applies to customers, people\n' +
          'who want to get food, and home cooks, people who cook the food and are willing to share.\n' +
          'By using our platform, you, as a user, agree to the terms and conditions of the Privacy\n' +
          'Policy, which includes future additions and changes. In case, if you do not agree with any of\n' +
          'the terms and conditions, please do not use the website.\n' +
          ' \n' +
          'Information provided by the Users\n' +
          'We collect information in a variety of circumstances when you use our website.\n' +
          'Some instances of those circumstances as follows. \n' +
          ' When you register, you provide us with information regarding email, first name, last\n' +
          'name, email, etc. After signing up, you are in a position to provide more information\n' +
          'about you, to us. This information would be stored in our database. However, it will\n' +
          'be encrypted for your privacy \n' +
          ' When you use a card to pay, a third-party payment service receives your card\n' +
          'information. We do not store that information in our database. \n' +
          ' When you use our website to rate a home cook, we will save it on the database.\n' +
          'However, it will be protected.   \n' +
          'When we collect information about, it is to provide a good service for you. For example, we\n' +
          'use your username and password to uniquely identify you. We also receive information\n' +
          'when you interact with another user (home cooks or/and customers). We can make a\n' +
          'promise that all the information we are collecting will be used to enhance the user\n' +
          'experience. \n' +
          'Use of information collected from users\n' +
          'We enhance user experience in multiple ways. However, that requires us to collect\n' +
          'information. We use the information in the following ways.\n' +
          ' Improve our service.\n' +
          ' Promote our application. \n' +
          ' Communication with users.\n' +
          ' Prevention of fraud.\n' +
          'User information shared between customers and home cooks\n' +
          'We share information about the home cook’s dishes to the customer along with his/her\n' +
          'public profile. We will also be sharing the location of the user.\n' +
          'Miscellaneous sharing of information\n' +
          ' When disclosure of the information is needed to comply with the laws and\n' +
          'regulations.\n' +
          ' When there is a government request.\n' +
          ' Enforce policies\n' +
          ' With consent, you might be included in the featured home cooks.'
      sendEmail('adrianraj1818@gmail.com', password, s)
    }
  });
  userConnection.execSql(request);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
