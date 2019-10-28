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
var http = require('http');
var querystring = require('querystring');
const concat = require('concat-stream');

var Pusher = require('pusher');

var channels_client = new Pusher({
  appId: '888493',
  key: '244fae1265174aa1b9eb',
  secret: '2a96871bdc54e2e3629a',
  cluster: 'us2',
  encrypted: true
});

channels_client.trigger('my-channel1', 'my-event', {
  "message": "hello world"
});

// // const dotenv = require('dotenv')
const bodyParser = require('body-parser')
// const webpush = require('web-push')
var mysql = require('mysql');
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "mysqlroot",
//   database: "stou"
// });

var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
 
var con = mysql.createPool(connString);


// con.connect(function(err) {
//   if (err) throw err;
//   con.query('SELECT * FROM USER', function (err, rows, fields) {
//     if (err) throw err;
//     console.log(rows[0]);
//   });
// });

// // dotenv.config()
// app.use(bodyParser.json())
app.use(cors());

// webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

// app.post('/notifications/subscribe', (req, res) => {
//   const subscription = req.body

//   console.log(subscription)

//   const payload = JSON.stringify({
//     title: 'Hello!',
//     body: 'It works.',
//   })

//   webpush.sendNotification(subscription, payload)
//     .then(result => console.log(result))
//     .catch(e => console.log(e.stack))

//   res.status(200).json({'success': true})
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 5000);

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

app.listen(app.settings.port, () => console.log("Listening on port " + app.settings.port))

app.use('/placeorder', function (req, res, next) {
  console.log(req.body)
  const orderID = uuidv4();
  const cookEmail = req.body['data']['cookEmail'];
  const customerEmail = req.body['data']['customerEmail'];
  const instructions = req.body['data']['instructions'];
  const deliveryTime = req.body['data']['deliveryTime'];
  const orderStatus = req.body['data']['orderStatus'];
  const orderAddress = req.body['data']['orderAddress'];
  const itemList = req.body['data']['itemList'];
  const subTotal = req.body['data']['subTotal'];
  console.log("cemail: "+itemList[0].foodId);

  var o = {};

  console.log(req.body.data);
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'Insert into ORDERS values(\''+ orderID +'\', CURRENT_TIMESTAMP, \''+ cookEmail +'\', \''+customerEmail+'\', \''+ instructions +'\', CURRENT_TIMESTAMP, \''+ orderAddress + '\',\'' + orderStatus + '\', \'\');';
    console.log('MEssage:' + q);
    connection.query(q, function (err, rows) {
      if (err) throw err;

      else {
        for(let i =0; i < itemList.length; i++){
          console.log('in');
          con.getConnection(function(err, connection) {
            if (err) throw err;
            console.log(itemList[i]);
            var q = 'Insert into ORDER_FOOD (ORDER_ID, FOOD_ID, QUANTITY, PRICE) values(\''+orderID+'\', \''+itemList[i].foodId+'\', '+itemList[i].quantity + ', '+ itemList[i].price + ');';
            console.log(q);
            connection.query(q, function (err, rows) {
              if (err) throw err;
            });
            connection.release();
          });
        }
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Order placed';
        res.send(o);
      }
    });
    connection.release();
  });

});

app.use('/setlocation', function(req, res, next){
  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  const location = req.body['data']['location'];
  if (role === 'Homecook') {
    role = 'COOK';
  }
  var o = {};
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET LOCATION = ' + location + ' WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid customer';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Location updated';
        res.send(o);
      }
      console.log(rows[0]);
    });
    connection.release();
  });
});

app.use('/getlocation', function(req, res, next){
  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  if (role === 'Homecook') {
    role = 'COOK';
  }
  var o = {};
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM USER WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'User does not exist!';
        res.send(o);
      }
      else {
        o['data'] = {'location': rows[0].LOCATION};
        o['code'] = 200;
        res.status(200);
        res.send(o);
      }
      console.log(rows[0]);
    });
    connection.release();
  });
});

app.use('/logout', function(req, res, next){
  const token = req.param('token');
  delete revLoginTokens[loginTokens[token]];
  delete loginTokens[token];
  res.status(200);
  res.send({'code': '200', 'message': 'Logout successful'});
});


app.use('/getallfood', function(req, res, next){
  let location = req.body['data']['location'];
  let o = {};
  con.getConnection(function(err, connection) {
    if (err) console.log(err);
    var q = 'SELECT FOOD.PICTURE, FOOD_ID, COOK_EMAIL, TITLE, DESCRIPTION, CUISINE, PRICE, CALORIES, FIRST_NAME, LAST_NAME FROM FOOD, USER WHERE FOOD.COOK_EMAIL=USER.EMAIL AND USER.ROLE=1 AND (LOCATION BETWEEN ' + (parseInt(location) - 2) + ' AND ' + (parseInt(location) +2) + ');';
    
    connection.query(q, function (err, result) {
      if (err) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'No food offered now';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        for(var i = 0; i < result.length; i++){
          var row = result[i];
          // console.log(row);
          ob['name'] = row.TITLE;
          ob['homecook'] = row.FIRST_NAME + " " + row.LAST_NAME;
          ob['email'] = row.COOK_EMAIL;
          ob['description'] = row.DESCRIPTION;
          ob['price'] = row.PRICE;
          ob['cuisine'] = row.CUISINE;
          ob['calories'] = row.CALORIES;
          ob['picture'] = row.PICTURE;
          ob['food_id'] = row.FOOD_ID;
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        console.log(o);
        if(obj.length !== 0)
          res.send(o);

      }
      connection.release();
    });
  });
});

app.use('/getfooditems', function(req,res,next){
  const email = req.param('email');
  let o = {};
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM FOOD WHERE COOK_EMAIL= "' + email + '";';
    connection.query(q, function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'No food offered now';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        for(var i = 0; i < result.length; i++){
          var row = result[i];
          ob['name'] = row.TITLE;
          ob['price'] = row.PRICE;
          ob['cuisine'] = row.CUISINE;
          ob['calories'] = row.CALORIES;
          ob['picture'] = row.PICTURE;
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        console.log(o);
        if(obj.length !== 0)
          res.send(o);

      }
      connection.release();
    });
  });
});


app.use('/gethomecooks', function(req,res,next){
  console.log(req.body)
  let location = req.body['data']['location'];
  let o = {};
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM USER, ROLES WHERE USER.ROLE=ROLES.ROLE_ID AND ROLE_DESC="COOK" AND (LOCATION BETWEEN ' + (parseInt(location) - 2) + ' AND ' + (parseInt(location) +2) + ');';
    connection.query(q, function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'No Homecooks in this region.. yet!';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        for(var i = 0; i < result.length; i++){
          var row = result[i];
          ob['name'] = row.FIRST_NAME + " " + row.LAST_NAME;
          ob['email'] = row.EMAIL;
          ob['rating'] = row.RATING;
          ob['aboutMe'] = row.ABOUT_ME;
          // ob['cuisines'] = row.CUISINES;
          ob['profilePicture'] = row.PICTURE;
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        console.log(o);
        if(obj.length !== 0)
          res.send(o);
      }
      connection.release();
    });
  });
});


app.use('/addfooditem', function(req, res, next){
  const itemName = req.body['data']['itemName'];
  const cook_email = req.body['data']['homecook'];
  const food_id = uuidv4();
  const token = req.body['data']['token'];
  const location = req.body['data']['location'];
  const price = req.body['data']['price'];
  const allergens = req.body['data']['allergens'];
  const cuisine = req.body['data']['cuisine'];
  const calories = req.body['data']['calories'];
  const picture = req.body['data']['picture'];
  const desc = req.body['data']['description'];
  let o ={};
  // console.log(token)
  // console.log('insert into FoodItems values(\'' + itemName + '\', \'' + loginTokens[token] + '\', \'' + location + '\', \'' + price + '\', \'' + allergens +'\', \'' + cuisine + '\', \'' + calories +'\', \'' + picture + '\', \'' + desc + '\')')
  
  con.getConnection(function(err, connection) {
    if (err) console.log(err);
    let cuisine_present = false;
    if(cuisine != null) {
      var q = 'SELECT * FROM CUISINES WHERE CUISINE="' + cuisine + '";';
      console.log(q);
      connection.query(q, function (err, result) {
        if (err) console.log(err);
        // console.log(result.length);
        if (result.length === 0) {
          cuisine_present = false;
          // console.log(cuisine_present);
        }
        else {
          cuisine_present = true;
          // console.log(cuisine_present);
        }
        // connection.release();
      });
    }
    // console.log(cuisine_present);
    
    if((cuisine_present === false) && (cuisine_present != null)) {
      q = 'INSERT INTO CUISINES (CUISINE) VALUES ("' + cuisine + '");';
      console.log(q);
      connection.query(q, function (err, result) {
        if (err) {
          console.log(err);
        }
        
          console.log(cuisine_present);
          var columns = "(";
          var values = "(";
          if(itemName != null) {
            columns += "TITLE, ";
            values += '"' + itemName + '", ';
          } 
          if(price != null) {
            columns += "PRICE, ";
            values += price + ", ";
          }
          if(cuisine != null) {
            columns += "CUISINE, ";
            values += '"' + cuisine + '", ';
          }
          if(calories != null) {
            columns += "CALORIES, ";
            values += calories + ", ";
          }
          if(picture != null) {
            columns += "PICTURE, ";
            values += '"' + picture + '", ';
          }
          if(desc != null) {
            columns += "DESCRIPTION, ";
            values += '"' + desc + '", ';
          }
          columns += "FOOD_ID, VALID, ";
          values += '"' + food_id + '", "true", ';


          columns += "COOK_EMAIL) ";
          values += '"' + cook_email + '") ';

          q = 'INSERT INTO FOOD ' + columns + 'VALUES ' + values + ';';
          console.log(q);
          connection.query(q, function (err, result) {
            if (err) {
              o['code'] = 400;
              res.status(400)
              o['message'] = 'Failed to add food';
              res.send(o);
            }
            else {
              o['code'] = 200;
              res.status(200)
              o['message'] = itemName + ' added';
              res.send(o);
            }
            connection.release();
          });
        
        // connection.release();
      });
    }
    
  });
});




app.use('/editProfile', function(req,res,next){

  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  const aboutMe = req.body['data']['aboutMe'];
  const name = req.body['data']['name'];
  const profilePicture = req.body['data']['profilePicture'];
  const firstName = name.toString().split(' ')[0];
  const lastName = name.toString().split(' ')[1];

  if(role === 'Homecook') role = 'COOK';

  // console.log(profilePicture);
  // console.log(aboutMe);
  // console.log(lastName);
  // console.log(name);

  if(firstName === null) {
    firstName = '';
  }
  if(lastName === null) {
    lastName = '';
  }
  if(aboutMe === null) {
    aboutMe = 'None';
  }
  if(profilePicture === null) {
    profilePicture = 'None';
  }
  if(name === null) {
    name = 'None';
  }
  console.log(email);
  console.log(role);
  let o = {};
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET ABOUT_ME="' + aboutMe + '", FIRST_NAME="' + firstName +'", LAST_NAME="' + lastName + '" , PICTURE="' + profilePicture + '" where EMAIL="' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    console.log(q);
    connection.query(q, function (err, result) {
      console.log(result);
      if(err) {
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
      connection.release();
    });
  });
});

app.use('/profile', function(req, res, next) {
  console.log("profile");
  let email = req.body['data']['email'];
  let role = req.body['data']['role'];
  if(role === 'Homecook') role = 'COOK';
  console.log(email);
  let o = {};
  con.getConnection(function(err, connection) {
    if (err) console.log(err);
    var q = 'SELECT * FROM USER WHERE EMAIL= "' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, result) {
      if (err) console.log(err);
      if (result.length === 0) {
        o['code'] = 404;
        res.status(404)
        o['message'] = 'User not found';
        res.send(o);
      }
      else {
        var row = result[0];
        console.log(row);
        o['name'] = row.FIRST_NAME;
        if(row.LAST_NAME) {
          o['name'] += " ";
          o['name'] += row.LAST_NAME;
        }
        // o['name'] = row.FIRST_NAME + row.LAST_NAME;
        o['aboutMe'] = row.ABOUT_ME;
        o['cuisines'] = 'None';
        o['profilePicture'] = row.PICTURE;
        console.log(o);
        if(o['code'] !== 404)
        res.send(o);
      }
      connection.release();
    });
  });
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
  console.log(email);
  var o = {};
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET PASSWORD = "' + encPassword + '" WHERE EMAIL="' + encEmail + '";';
    connection.query(q, function (err, rows) {
      // console.log(rows);
      if (err) {
        console.log("reset failed");
        o['code'] = 404;
        res.status(404)
        o['message'] = 'Reset failed';
        res.send(o);
      } else {
        sendEmail(email, password, 'Here\'s your new password: ' + password);
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Password et successfully';
        res.send(o);
      }
      connection.release();
    });
  });
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
  
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET PASSWORD = "' + newPw + '" WHERE EMAIL="' + email + '" AND PASSWORD="' + oldPw + '";';
    connection.query(q, function (err, rows) {
      if (err) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'Reset failed';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200)
        o['message'] = 'Password reset successfully';
        res.send(o);
      }
      connection.release();
    });
  });
});


app.use('/login', function(req, res, next){
  const email = req.body['data']['email'];
  const password = req.body['data']['password'];
  let role = req.body['data']['role'];
  if(role === 'Homecook') role = 'cook';
  var o = {};
  
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'SELECT FIRST_NAME, LAST_NAME FROM USER WHERE EMAIL = "' + email + '" AND PASSWORD = "' + password + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC = "' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if(rows.length === 0) {
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
      connection.release();
    });
  });
});



app.use('/register', function(req,res,next){
  const firstName = req.body['data']['firstName'];
  const lastName = req.body['data']['lastName'];
  const email = req.body['data']['email'];
  const password = req.body['data']['password'];
  const role = req.body['data']['role'];
  const cuisines = 'None';

  let o = {};

  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'SELECT FIRST_NAME, LAST_NAME FROM USER WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC = "' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) {
        console.log(err);
        o['code'] = 400;
        o['message'] = 'Error occurred';
        res.status(400)
        res.send(o);
      }
      else if(rows.length !== 0) {
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
      connection.release();
    });
  });
});

function registerUser(firstName, lastName, email, password, role, cuisines) {
  console.log(role);
  if(role === 'Homecook') role = 'COOK';
  con.getConnection(function(err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE) values("' + firstName + '", "' + lastName + '", "' + email + '", "' + password + '", (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '"));';
    connection.query(q, function (err, rows) {
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
            ' \n' +
            'Information provided by the Users\n' +
            'We collect information in a variety of circumstances when you use our website.\n' +
            'Some instances of those circumstances as follows. \n' +
            ' When you register, you provide us with information regarding email, first name, last\n' +
            'name, email, etc. After signing up, you are in a position to provide more information\n' +
            'about you, to us. This information would be stored in our database. However, it will\n' +
            'be encrypted for your privacy \n' +
            ' When you use a card to pay, a third-party payment service receives your card\n' +
            'information. We do not store that information in our database. \n' +
            ' When you use our website to rate a home cook, we will save it on the database.\n' +
            'However, it will be protected.   \n' +
            'When we collect information about, it is to provide a good service for you. For example, we\n' +
            'use your username and password to uniquely identify you. We also receive information\n' +
            'when you interact with another user (home cooks or/and customers). We can make a\n' +
            'promise that all the information we are collecting will be used to enhance the user\n' +
            'experience. \n' +
            'Use of information collected from users\n' +
            'We enhance user experience in multiple ways. However, that requires us to collect\n' +
            'information. We use the information in the following ways.\n' +
            ' Improve our service.\n' +
            ' Promote our application. \n' +
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
      connection.release();
    });
  });
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