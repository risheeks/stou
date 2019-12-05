var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var testRouter = require('./routes/test');
var usersRouter = require('./routes/users');
var setViewsRouter = require('./routes/setViews');
var logToFileRouter = require('./routes/logToFile');
var getTopFoodRouter = require('./routes/getTopFood');
var getViewsRouter = require('./routes/getViews');
var shareAppRouter = require('./routes/shareApp');
var getRoomIdRouter = require('./routes/getRoomId');
var checkPromoCodeRouter = require('./routes/checkPromoCode');
var usePromoCodeRouter = require('./routes/usePromoCode');
var getCustomersFollowingHomecookRouter = require('./routes/getCustomersFollowingHomecook');
var changeBanStatusRouter = require('./routes/changeBanStatus');
var getBanStatusRouter = require('./routes/getBanStatus');
var changeRequestStatusRouter = require('./routes/changeRequestStatus');
var getRequestRouter = require('./routes/getRequest');
var addRequestRouter = require('./routes/addRequest');
var getReviewRatingRouter = require('./routes/getReviewRating');
var setReviewRatingRouter = require('./routes/setReviewRating');
var setFeedbackRouter = require('./routes/setFeedBack');
var getFeedbackRouter = require('./routes/getFeedback');
var setOrderStatusRouter = require('./routes/setOrderStatus');
var getAllOrdersRouter = require('./routes/getAllOrders');
var getFoodItemsByOrderRouter = require('./routes/getFoodItemsByOrder');
var getCustomerOrdersRouter = require('./routes/getCustomerOrders');
var getRecentOrdersRouter = require('./routes/getRecentOrders');
var getDetailsByOrderRouter = require('./routes/getDetailsByOrder');
var getStatusRouter = require('./routes/getStatus');
var placeOrderRouter = require('./routes/placeOrder');
var setLocationRouter = require('./routes/setLocation');
var getLocationRouter = require('./routes/getLocation');
var removeFavoriteHomecooksRouter = require('./routes/removeFavoriteHomecooks');
var removeFavoriteFoodRouter = require('./routes/removeFavoriteFood');
var getPastFoodCookRouter = require('./routes/getPastFoodCook');
var getPastFoodRouter = require('./routes/getPastFood');
var getAllFoodRouter = require('./routes/getAllFood');
var getFoodItemsRouter = require('./routes/getFoodItems');
var getHomecooksRouter = require('./routes/getHomecooks');
var getAllUsersRouter = require('./routes/getAllUsers');
var getNumberOfUsersRouter = require('./routes/getNumberOfUsers');
var addFoodItemRouter = require('./routes/addFoodItem');
var editProfileRouter = require('./routes/editProfile');
var profileRouter = require('./routes/profile');
var filterRouter = require('./routes/filter');
var forgotPasswordRouter = require('./routes/forgotPassword');
var setStatusRouter = require('./routes/setStatus');
var setFavoriteHomecooksRouter = require('./routes/setFavoriteHomecooks');
var setFavoriteFoodRouter = require('./routes/setFavoriteFood');
var getFavoriteHomecooksRouter = require('./routes/getFavoriteHomecooks');
var resetPasswordRouter = require('./routes/resetPassword');

var cors = require('cors');
var app = express();
const Chatkit = require('@pusher/chatkit-server');
const instance_locator_id = 'v1:us1:16fd20fa-20b1-4bc1-9e3a-47adc4e2320b';
const chatkit_secret = 'f5fa044f-cc78-4874-8973-b4952bfcc68b:4+eZch6kWQ1gtBpqWtW8EpHsTKJ09frIR3ftWScTPes=';
const chatkit = new Chatkit.default({
  instanceLocator: instance_locator_id,
  key: chatkit_secret,
});
var http = require('http');
var querystring = require('querystring');
const concat = require('concat-stream');

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '888493',
  key: '244fae1265174aa1b9eb',
  secret: '2a96871bdc54e2e3629a',
  cluster: 'us2',
  encrypted: true
});

const bodyParser = require('body-parser')
var mysql = require('mysql');

var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';

var con = mysql.createPool(connString);

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 5000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


let loginTokens = {};
let revLoginTokens = {};

const uuidv4 = require('uuid/v4');

app.listen(app.settings.port, () => console.log("Listening on port " + app.settings.port));


/*
test routes
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

//==================================================================================================//

/*
actual routes
 */
app.use('/setViews', setViewsRouter);

app.use('/logtofile', logToFileRouter);

app.use('/gettopfood', getTopFoodRouter);

app.use('/getviews', getViewsRouter);

app.use('/shareapp', shareAppRouter);

app.use('/getroomid', getRoomIdRouter);

app.use('/checkpromocode', checkPromoCodeRouter);

app.use('/usepromocode', usePromoCodeRouter);

app.use('/getcustomersfollowinghomecook', getCustomersFollowingHomecookRouter);

app.use('/changebanstatus', changeBanStatusRouter);

app.use('/getbanstatus', getBanStatusRouter);

app.use('/changerequeststatus', changeRequestStatusRouter);

app.use('/getrequest', getRequestRouter);

app.use('/addrequest', addRequestRouter);

app.use('/getreviewrating', getReviewRatingRouter);

app.use('/setreviewrating', setReviewRatingRouter);

app.use('/setfeedback', setFeedbackRouter);

app.use('/getfeedback', getFeedbackRouter);

app.use('/setorderstatus', setOrderStatusRouter);

app.use('/getallorders', getAllOrdersRouter);

app.use('/getfooditemsbyorder', getFoodItemsByOrderRouter);

app.use('/getcustomerorders', getCustomerOrdersRouter);

app.use('/getrecentorders', getRecentOrdersRouter);

app.use('/getdetailsbyorder', getDetailsByOrderRouter);

app.use('/getstatus', getStatusRouter);

app.use('/placeorder', placeOrderRouter);

app.use('/setlocation', setLocationRouter);

app.use('/getlocation', getLocationRouter);

app.use('/removefavoritehomecooks', removeFavoriteHomecooksRouter);

app.use('/removefavoritefood', removeFavoriteFoodRouter);

app.use('/getpastfoodcook', getPastFoodCookRouter);

app.use('/getpastfood', getPastFoodRouter);

app.use('/getallfood', getAllFoodRouter);

app.use('/getfooditems', getFoodItemsRouter);

app.use('/gethomecooks', getHomecooksRouter);

app.use('/getallusers', getAllUsersRouter);

app.use('/getnumberofusers', getNumberOfUsersRouter);

app.use('/addfooditem', addFoodItemRouter);

app.use('/editProfile', editProfileRouter);

app.use('/profile', profileRouter);

app.use('/filter', filterRouter);

app.use('/forgotpassword', forgotPasswordRouter);

app.use('/setstatus', setStatusRouter);

app.use('/setfavoritehomecooks', setFavoriteHomecooksRouter);

app.use('/setfavoritefood', setFavoriteFoodRouter);

app.use('/getfavoritehomecooks', getFavoriteHomecooksRouter);

app.use('/resetpassword', resetPasswordRouter);

app.use('/register', function (req, res, next) {
  const firstName = req.body['data']['firstName'];
  const lastName = req.body['data']['lastName'];
  const email = req.body['data']['email'];
  const password = req.body['data']['password'];
  let role = req.body['data']['role'];
  const cuisines = 'None';
  if (role === 'Homecook') role = 'COOK';

  let o = {};

  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT FIRST_NAME, LAST_NAME FROM USER WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC = "' + role + '");';
    connection.query(q, function (err, rows) {

      if (err) {
        o['code'] = 400;
        o['message'] = 'Error occurred';
        res.status(400)
        res.send(o);
      }
      else if (rows.length > 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'User already registered';
        res.send(o);
      } else if (!err) {
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

  let pic = '';
  if (role === 'Homecook') role = 'COOK';
  if (role === 'COOK') {
    pic = 'https://firebasestorage.googleapis.com/v0/b/stou-79b9a.appspot.com/o/3.png?alt=media&token=a3fb8d89-3afc-48ea-9b07-bf7c26699ef4';
  } else {
    pic = 'https://firebasestorage.googleapis.com/v0/b/stou-79b9a.appspot.com/o/4.png?alt=media&token=47d52479-c8cf-46a1-8116-e5f1bc8765f7';
  }
  chatkit.createUser({
    id: email,
    name: firstName + " " + lastName,
    avatarURL: pic
  })
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO USER (PICTURE, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE, BANNED) values("' + pic + '", "' + firstName + '", "' + lastName + '", "' + email + '", "' + password + '", (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '"), 0);';
    connection.query(q, function (err, rows) {
      if (err) {
        console.log(err);
      }
      else {
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
        sendEmail(email, password, s)
      }
      connection.release();
    });
  });
}

function sendEmail(email, password = "", text, subject = 'Password Reset') {
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
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
app.use('/checklogin', function (req, res, next) {
  const o = checkLogin(req.body['data']['email'], req.body['data']['token']);
  res.status(o['code']);
  res.send(o);
});


function checkLogin(email, token) {
  var o = {};
  const tok = revLoginTokens[email];
  if (tok === token) {
    o['code'] = 200;
    o['message'] = '';
    o['token'] = token;
  } else {
    o['code'] = 401;
    o['message'] = 'Unauthorized client error';
  }
  return o;
}

app.use('/login', function (req, res, next) {
  const email = req.body['data']['email'];
  const password = req.body['data']['password'];
  let role = req.body['data']['role'];
  if (role === 'Homecook') role = 'cook';
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT FIRST_NAME, LAST_NAME, BANNED FROM USER WHERE EMAIL = "' + email + '" AND PASSWORD = "' + password + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC = "' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 401;
        o['message'] = 'Invalid login credentials';
        res.status(401);
        res.send(o);
      }
      else if (rows[0].BANNED) {
        o['code'] = 401;
        o['message'] = 'Sorry, you have been banned for misconduct. Please contact customer support if you think this is a mistake.';
        res.status(401);
        res.send(o);
      }
      else {
        o['code'] = 200;
        o['message'] = 'Login successful';
        o['token'] = uuidv4();
        loginTokens[o['token']] = email;
        revLoginTokens[email] = o['token'];

        res.status(200);
        res.send(o);
      }
      connection.release();
    });
  });
});

app.use('/logout', function (req, res, next) {
  const token = req.param('token');
  delete revLoginTokens[loginTokens[token]];
  delete loginTokens[token];
  res.status(200);
  res.send({ 'code': '200', 'message': 'Logout successful' });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.send();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports.con = con;