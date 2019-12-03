//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var Map = require('Map');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
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
app.use('/test', function (req, res) {
  res.send('testing');
});

let loginTokens = {};
let revLoginTokens = {};

const uuidv4 = require('uuid/v4');

app.listen(app.settings.port, () => console.log("Listening on port " + app.settings.port));

app.use('/shareapp', function(req,res,next){
  let email = req.body['data']['email'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM USER WHERE CUSTOMER_EMAIL=\'' + email + '\';';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 202;
        res.status(202);
        let text = 'App link, Enjoy 10% off on your order with this promo code' + generatePromoCode;
        sendEmail(email, text, 'ENJOY STOU');
        o['message'] = 'Shared App Successfully';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'User already registered';
        res.send(o);
      }
    });
    connection.release();
  });

});

app.use('/getnamefromemail', function(req,res,next){
  let email = req.body['data']['email'];
  let role = req.body['data']['role'];
  let q = "";
  if(role === 1) {
    q = 'SELECT FIRST_NAME,LAST_NAME FROM USER WHERE COOK_EMAIL=\'' + email + '\';';
  } else {
    q = 'SELECT FIRST_NAME,LAST_NAME FROM USER WHERE CUSTOMER_EMAIL=\'' + email + '\';';
  }
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'User Not Found';
        res.send(o);
      } else {
        o['data'] = rows[0].FIRST_NAME + ' ' + rows[0].LAST_NAME;
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Success';
        res.send(o);
      }
    });
    connection.release();
  });
});


app.use('/getroomid', function(req,res,next) {
    let email = req.body['data']['email'];
    let role = req.body['data']['role']
    var o = {};
    let q = "";
    if(role === 1) {
      q = 'SELECT CUSTOMER_EMAIL, COOK_EMAIL FROM ORDERS WHERE COOK_EMAIL=\'' + email + '\';';
    } else {
      q = 'SELECT CUSTOMER_EMAIL, COOK_EMAIL FROM ORDERS WHERE CUSTOMER_EMAIL=\'' + email + '\';';
    }

  con.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'No Orders Found';
                res.send(o);
            } else {
                let idSet = new Set();
                for(i=0; i < rows.length; i++) {
                    idSet.add(rows[i].CUSTOMER_EMAIL+"-"+rows[i].COOK_EMAIL);
                }
                o['data'] = Array.from(idSet.values())
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Success';
                res.send(o);
            }
        });
        connection.release();
    });
});

app.use('/checkpromocode', function (req, res, next) {
  let promoCode = req.body['data']['promoCode'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM PROMOCODES WHERE PROMO_CODE=\'' + promoCode + '\' AND STATUS=0;';
    console.log(q)
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'Promo Code Not Found';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Promo Code valid';
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/usepromocode', function (req, res, next) {
  let promoCode = req.body['data']['promoCode'];
  let status = req.body['data']['status']
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE PROMOCODES SET STATUS=' + status + ' WHERE PROMO_CODE=\'' + promoCode + '\';';
    console.log(q)
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'Promo Code Not Found';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Promo Code Used';
        res.send(o);
      }
    });
    connection.release();
  });
});

 generatePromoCode = function (req, res, next) {
  var o = {};
  let promoCode = uuidv4();
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO PROMOCODES VALUES(\'' + promoCode + '\', 0);';
    connection.query(q, function (err, rows) {
      if (err) throw err;
    });
    connection.release();
  });
  return promoCode;
};


app.use('/getcustomersfollowinghomecook', function (req, res, next) {
  const cookEmail = req.body['data']['cookEmail'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * from FAVORITE_HOMECOOKS where COOK_EMAIL=\'' + cookEmail + '\');';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'Cook Not Found';
        res.send(o);
      } else {
        let list = [];
        for (i = 0; i < rows.length; i++) {
          list.push(rows[i].CUSTOMER_EMAIL);
        }
        o['code'] = 200;
        res.status(200);
        o['data'] = list;
        o['message'] = 'Success';
        res.send(o);
      }
    });
    connection.release();
  });
});



app.use('/changebanstatus', function (req, res, next) {
  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  let status = req.body['data']['status'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET BANNED=' + status + ' WHERE EMAIL="' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'User Not Found';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Status changed successfully';
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getbanstatus', function (req, res, next) {
  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT BANNED from USER where EMAIL=\'' + email + '\' AND ROLE=' + role + ');';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'User Not Found';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200);
        o['data'] = { 'bannedStatus': rows[0].BANNED };
        o['message'] = 'Success';
        res.send(o);
      }
    });
    connection.release();
  });
});


app.use('/changerequeststatus', function (req, res, next) {
  const cookEmail = req.body['data']['cookEmail'];
  const customerEmail = req.body['data']['customerEmail'];
  const itemName = req.body['data']['itemName'];
  const status = req.body['data']['status'];

  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE REQUESTS SET STATUS=' + status + ' WHERE COOK_EMAIL=\'' + cookEmail + '\' AND CUSTOMER_EMAIL=\'' + customerEmail + '\' AND ITEM_NAME=\'' + itemName + '\';';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 500;
        res.status(500);
        o['message'] = 'Internal Server Error';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Status changed';
        res.send(o);
      }
    });
    connection.release();
  });
});


app.use('/getrequest', function (req, res, next) {
  const email = req.body['data']['email'];
  const role = req.body['data']['role'];
  let q = '';
  if (role === 1) {
    q = 'SELECT * FROM REQUESTS WHERE COOK_EMAIL=\'' + email + '\'';
  } else {
    q = 'SELECT * FROM REQUESTS WHERE CUSTOMER_EMAIL=\'' + email + '\'';
  }
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'User Not Found';
        res.send(o);
      }
      else {
        let obList = [];
        var ob = {};
        for (i = 0; i < rows.length; i++) {
          ob = { 'cookEmail': rows[i].COOK_EMAIL, 'customerEmail': rows[i].CUSTOMER_EMAIL, 'itemName': rows[i].ITEM_NAME, 'itemDescription': rows[i].ITEM_DESCRIPTION, 'status': rows[i].STATUS };
          obList.push(ob);
          ob = {};
        }
        o['data'] = obList;
        o['code'] = 200;
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/addrequest', function (req, res, next) {
  const cookEmail = req.body['data']['cookEmail'];
  const customerEmail = req.body['data']['customerEmail'];
  const itemName = req.body['data']['itemName'];
  const itemDescription = req.body['data']['itemDescription'];

  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO REQUESTS VALUES (\'' + cookEmail + '\', \'' + customerEmail + '\', \'' + itemName + '\', \'' + itemDescription + '\', 0);';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 500;
        res.status(500);
        o['message'] = 'Internal Server Error';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Request added';
        res.send(o);
      }
    });
    connection.release();
  });
});



app.use('/getreviewrating', function (req, res, next) {
  const email = req.body['data']['email'];
  const role = req.body['data']['role'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT FIRST_NAME, LAST_NAME, RATING FROM USER WHERE EMAIL=\'' + email + '\' AND ROLE=' + role + ';';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'User Not Found';
        res.send(o);
      }
      else {
        let obList = [];

        let ob = {
          'name': rows[0].FIRST_NAME + ' ' + rows[0].LAST_NAME,
          'averageRating': rows[0].RATING
        };
        obList.push(ob);
        con.getConnection(function (err, connection) {
          if (err) throw err;
          var q = 'SELECT FIRST_NAME, LAST_NAME, REVIEW, ORDERS.COOK_RATING FROM ORDERS, USER WHERE CUSTOMER_EMAIL=EMAIL AND COOK_EMAIL=\'' + email + '\''
          connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
              o['code'] = 404;
              res.status(404);
              o['message'] = 'No Reviews Found';
              res.send(o);
            }
            else {
              let tempList = [];
              let tempOb = {};
              for (i = 0; i < rows.length; i++) {
                tempOb = {
                  'customer': rows[i].FIRST_NAME + " " + rows[i].LAST_NAME,
                  'review': rows[i].REVIEW,
                  'rating': rows[i].COOK_RATING
                };
                tempList.push(tempOb);
                tempOb = {};
              }
              obList.push(tempList);
              o['data'] = obList;
              o['code'] = 200;
              res.status(200);
              res.send(o);
            }
          });
          connection.release();
        });
      }
    });
    connection.release();
  });
});



app.use('/setreviewrating', function (req, res, next) {


  const email = req.body['data']['email'];
  let rating = req.body['data']['rating'];
  let role = req.body['data']['role'];
  let orderId = req.body['data']['orderId'];
  let review = req.body['data']['review'];

  // console.log(email + " " + rating + " " + role + " " + orderId + review)
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = '';
    if (role === 2) {
      q = 'UPDATE ORDERS SET REVIEW=\'' + review + '\', CUSTOMER_RATING=' + rating + ' WHERE ORDER_ID=\'' + orderId + '\';';
    }
    else if (role === 1) {
      q = 'UPDATE ORDERS SET COOK_RATING=' + rating + ' WHERE ORDER_ID=\'' + orderId + '\';';
    }
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'Order Not Found';
        res.send(o);
      }
    });
    connection.release();
  });

  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT RATING, NUMRATINGS from USER where EMAIL=\'' + email + '\' AND ROLE=' + role + ';';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 404;
        res.status(404);
        o['message'] = 'User Not Found';
        res.send(o);
      }
      else {
        let currentRating = 0;
        let numRatings = 0;
        if (rows[0].RATING !== null) {
          currentRating = rows[0].RATING;
        }
        if (rows[0].NUMRATINGS !== null) {
          numRatings = rows[0].NUMRATINGS;
        }
        let newRating = ((parseFloat(currentRating) * parseInt(numRatings)) + parseFloat(rating)) / parseInt(numRatings + 1);
        con.getConnection(function (err, connection) {
          if (err) throw err;
          var q = 'UPDATE USER SET RATING=' + newRating + ', NUMRATINGS=' + (numRatings + 1) + ' WHERE EMAIL=\'' + email + '\' AND ROLE=' + role + ';';
          connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
              o['code'] = 500;
              res.status(500);
              o['message'] = 'Internal Server Error';
              res.send(o);
            }
            else {
              o['code'] = 200;
              res.status(200);
              o['message'] = 'Rating updated';
              res.send(o);
            }
          });
          connection.release();
        });
      }
    });
    connection.release();
  });
});



app.use('/setfeedback', function (req, res, next) {
  const email = req.body['data']['email'];
  let feedback = req.body['data']['feedback'];

  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO FEEDBACK VALUES (\'' + email + '\', \'' + feedback + '\');';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 500;
        res.status(500);
        o['message'] = 'Internal Server Error';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Feedback added';
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getfeedback', function (req, res, next) {
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM FEEDBACK';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'No feedback found';
        res.send(o);
      }
      else {
        let obList = [];
        var ob = {};
        for (i = 0; i < rows.length; i++) {
          ob = { 'email': rows[i].EMAIL, 'feedback': rows[i].FEEDBACK };
          obList.push(ob);
          ob = {};
        }
        o['data'] = obList;
        o['code'] = 200;
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/setorderstatus', function (req, res, next) {
  const orderId = req.body['data']['orderId'];
  const newOrderStatus = req.body['data']['orderStatus'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * from ORDERS where ORDER_ID=\'' + orderId + '\';';
    connection.query(q, function (err, rows) {
      if (err || rows.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'Invalid Order';
        res.send(o);
      } else {
        const currentOrderStatus = rows[0].ORDER_STATUS;
        const customerEmail = rows[0].CUSTOMER_EMAIL;
        const cookEmail = rows[0].COOK_EMAIL;
        let update = false;
        if (newOrderStatus === 'in_progress' && currentOrderStatus === 'placed') {
          update = true;
        } else if (newOrderStatus === 'on_the_way' && currentOrderStatus === 'in_progress') {
          update = true;
        } else if (newOrderStatus === 'delivered' && currentOrderStatus === 'on_the_way') {
          update = true;
        } else if (currentOrderStatus !== 'delivered' && newOrderStatus === 'cancelled') {
          update = true;
        } else if (currentOrderStatus === 'placed' && newOrderStatus === 'declined') {
          update = true;
        }
        else if (currentOrderStatus !== 'delivered' && currentOrderStatus !== 'on_the_way' && newOrderStatus === 'request_cancel') {
          update = true;
        }
        if (update) {
          con.getConnection(function (err, connection) {
            if (err) throw err;
            var q = 'UPDATE ORDERS SET ORDER_STATUS=\'' + newOrderStatus + '\' where ORDER_ID=\'' + orderId + '\';';
            connection.query(q, function (err, newRows) {
              if (err) {
                o['code'] = 400;
                res.status(400);
                o['message'] = 'Failed to update status';
                res.send(o);
              } else {
                if (currentOrderStatus === 'placed' && newOrderStatus === 'in_progress') {
                  chatkit.addUsersToRoom({
                    roomId: customerEmail + "-" + cookEmail,
                    userIds: [cookEmail, customerEmail],
                  })
                }
                if (newOrderStatus === 'delivered') {
                  var q = `SELECT * FROM ORDERS WHERE COOK_EMAIL="${cookEmail}" AND CUSTOMER_EMAIL="${customerEmail}" AND ORDER_STATUS NOT IN("delivered", "cancelled") AND ORDER_ID != "${orderId}";`;
                  connection.query(q, function (err, nRows) {
                    console.log(nRows[0])
                    if (nRows.length < 1) {
                      chatkit.removeUsersFromRoom({
                        roomId: customerEmail + "-" + cookEmail,
                        userIds: [cookEmail, customerEmail],
                      })
                    }
                  });
                }
                pusher.trigger(`customer-${customerEmail}`, 'order-update', {
                    "message": "Order status changed",
                    "order": {
                      "orderId": orderId,
                      "orderStatus": newOrderStatus,
                      "name": rows[0].FIRST_NAME + " " + rows[0].LAST_NAME,
                      "orderedAt": rows[0].ORDERED_AT,
                      "orderAddress": rows[0].ORDER_ADDRESS,
                      "rating": rows[0].RATING
                    }
                  });
                  o['code'] = 200;
                  res.status(200);
                  o['message'] = 'Status update successful';
                  res.send(o);
                }
              });
            connection.release();
          });
        }
        else {
          o['code'] = 400;
          res.status(400);
          o['message'] = 'Invalid Status Update';
          res.send(o);
        }
      }
    });
    connection.release();
  });

});

app.use('/getallorders', function (req, res, next) {
  const cookEmail = req.body['data']['cookEmail'];
  const status = req.body['data']['status'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    let q = 'SELECT * from ORDERS, USER where USER.EMAIL=ORDERS.CUSTOMER_EMAIL AND USER.ROLE=2 AND COOK_EMAIL="' + cookEmail + '" AND ORDER_STATUS="' + status + '" ORDER BY ORDERED_AT DESC;';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'Invalid Cook';
        res.send(o);
      }
      else {

        let obj = [];
        for (let i = 0; i < rows.length; i++) {
          let ord = {};
          ord['name'] = rows[i].FIRST_NAME + " " + rows[i].LAST_NAME;
          ord['orderId'] = rows[i].ORDER_ID;
          ord['orderedAt'] = rows[i].ORDERED_AT;
          ord['cookEmail'] = rows[i].COOK_EMAIL;
          ord['customerEmail'] = rows[i].CUSTOMER_EMAIL;
          ord['instructions'] = rows[i].INSTRUCTIONS;
          ord['deliveryTime'] = rows[i].DELIVERY_TIME;
          ord['orderAddress'] = rows[i].ORDER_ADDRESS;
          ord['orderStatus'] = rows[i].ORDER_STATUS;
          ord['rating'] = rows[i].CUSTOMER_RATING;
          obj.push(ord);
        }
        o = obj;
        o['code'] = 200;
        o['message'] = 'Success';
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getfooditemsbyorder', function (req, res, next) {
  const orderId = req.body['data']['orderId'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT TITLE, DESCRIPTION, QUANTITY, FOOD.PRICE AS PRICE from ORDER_FOOD, FOOD where ORDER_ID=\'' + orderId + '\' AND FOOD.FOOD_ID=ORDER_FOOD.FOOD_ID;';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid Order';
        res.send(o);
      } else {
        var obj = []
        var ord = {};
        for (let i = 0; i < rows.length; i++) {
          ord['title'] = rows[i].TITLE;
          ord['description'] = rows[i].DESCRIPTION;
          ord['quantity'] = rows[i].QUANTITY;
          ord['price'] = rows[i].PRICE;
          obj.push(ord);
        }
        o = obj;
        console.log(o);
        o['code'] = 200;
        o['message'] = 'Success';
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getcustomerorders', function (req, res, next) {
  const customerEmail = req.body['data']['customerEmail'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    let q = 'SELECT * from ORDERS, USER where USER.EMAIL=ORDERS.COOK_EMAIL AND USER.ROLE=1 AND CUSTOMER_EMAIL="' + customerEmail + '"AND ORDERS.CUSTOMER_RATING IS NULL ORDER BY ORDERED_AT DESC;';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid Cook';
        res.send(o);
      }
      else {
        let obj = [];
        for (let i = 0; i < rows.length; i++) {
          let ord = {};
          ord['name'] = rows[i].FIRST_NAME + " " + rows[i].LAST_NAME;
          ord['orderId'] = rows[i].ORDER_ID;
          ord['orderedAt'] = rows[i].ORDERED_AT;
          ord['cookEmail'] = rows[i].COOK_EMAIL;
          ord['customerEmail'] = rows[i].CUSTOMER_EMAIL;
          ord['instructions'] = rows[i].INSTRUCTIONS;
          ord['deliveryTime'] = rows[i].DELIVERY_TIME;
          ord['orderAddress'] = rows[i].ORDER_ADDRESS;
          ord['orderStatus'] = rows[i].ORDER_STATUS;
          ord['picture'] = rows[i].PICTURE;
          ord['rating'] = rows[i].COOK_RATING;
          obj.push(ord);
        }

        o = obj;
        o['code'] = 200;
        o['message'] = 'Success';
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getrecentorders', function (req, res, next) {
  const customerEmail = req.body['data']['customerEmail'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    let q = 'SELECT * from ORDERS, USER where USER.EMAIL=ORDERS.COOK_EMAIL AND USER.ROLE=1 AND CUSTOMER_EMAIL="' + customerEmail + '" AND ORDERED_AT > "' + (Date.now() - 2419200000) + '" ORDER BY ORDERED_AT DESC;';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid Cook';
        res.send(o);
      }
      else {
        let obj = [];
        for (let i = 0; i < rows.length; i++) {
          let ord = {};
          ord['name'] = rows[i].FIRST_NAME + " " + rows[i].LAST_NAME;
          ord['orderId'] = rows[i].ORDER_ID;
          ord['orderedAt'] = rows[i].ORDERED_AT;
          ord['cookEmail'] = rows[i].COOK_EMAIL;
          ord['customerEmail'] = rows[i].CUSTOMER_EMAIL;
          ord['instructions'] = rows[i].INSTRUCTIONS;
          ord['deliveryTime'] = rows[i].DELIVERY_TIME;
          ord['orderAddress'] = rows[i].ORDER_ADDRESS;
          ord['orderStatus'] = rows[i].ORDER_STATUS;
          ord['picture'] = rows[i].PICTURE;
          ord['rating'] = rows[i].COOK_RATING;
          obj.push(ord);
        }

        o = obj;
        o['code'] = 200;
        o['message'] = 'Success';
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getdetailsbyorder', function (req, res, next) {
  // console.log(req.body['data'])
  const orderId = req.body['data']['orderId'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * from ORDERS, USER where USER.EMAIL=ORDERS.COOK_EMAIL and USER.ROLE=1 and ORDER_ID=\'' + orderId + '\';';
    // console.log(q);
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid Order';
        res.send(o);
      } else {
        // console.log(rows[0]);
        var ord = {};
        ord['orderedAt'] = rows[0].ORDERED_AT;
        ord['orderAddress'] = rows[0].ORDER_ADDRESS;
        ord['cookEmail'] = rows[0].COOK_EMAIL;
        ord['customerEmail'] = rows[0].CUSTOMER_EMAIL;
        ord['cookName'] = rows[0].FIRST_NAME + " " + rows[0].LAST_NAME;
        ord['orderStatus'] = rows[0].ORDER_STATUS;
        ord['rating'] = rows[0].COOK_RATING;
        o['code'] = 200;
        o['message'] = 'Success';
        o['data'] = ord
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getstatus', function (req, res, next) {
  const cookEmail = req.body['data']['cookEmail'];
  let role = req.body['data']['role'];
  if (role === 'Homecook') {
    role = 'COOK';
  }
  var o = {};

  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT online from USER where EMAIL=\'' + cookEmail + '\' AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    console.log(q);
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid Cook';
        res.send(o);
      } else {
        o['code'] = 200;
        res.status(200);
        o['data'] = { 'status': rows[0].online };
        o['message'] = 'Success';
        res.send(o);
      }
      console.log(rows[0]);
    });
    connection.release();
  });
});

app.use('/placeorder', function (req, res, next) {
  console.log(req.body);
  const orderID = uuidv4();
  const cookEmail = req.body['data']['cookEmail'];
  const customerEmail = req.body['data']['customerEmail'];
  const instructions = req.body['data']['instructions'];
  const deliveryTime = req.body['data']['deliveryTime'];
  const orderStatus = req.body['data']['orderStatus'];
  const orderAddress = req.body['data']['orderAddress'];
  const itemList = req.body['data']['itemList'];
  const subTotal = req.body['data']['subTotal'];
  const paymentId = req.body['data']['paymentID'];

  var o = {};

  console.log(req.body.data);
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'Insert into ORDERS (ORDER_ID, ORDERED_AT, COOK_EMAIL, CUSTOMER_EMAIL, INSTRUCTIONS, DELIVERY_TIME, ORDER_ADDRESS, ORDER_STATUS, PAYMENT_KEY) values("' + orderID + '", "' + Date.now() + '", "' + cookEmail + '", "' + customerEmail + '", "' + instructions + '", ' + deliveryTime + ', "' + orderAddress + '", "' + orderStatus + '", "' + paymentId + '");';
    // console.log('MEssage:' + q);
    connection.query(q, function (err, rows) {
      if (err) throw err;

      else {
        for (let i = 0; i < itemList.length; i++) {
          // console.log('in');
          con.getConnection(function (err, connection) {
            if (err) throw err;
            console.log(itemList[i]);
            var q = 'Insert into ORDER_FOOD (ORDER_ID, FOOD_ID, QUANTITY, PRICE) values(\'' + orderID + '\', \'' + itemList[i].food_id + '\', ' + itemList[i].quantity + ', ' + itemList[i].price + ');';
            // console.log(q);
            connection.query(q, function (err, rows) {
              if (err) throw err;
            });
            connection.release();
          });
        }
        pusher.trigger(`cook-${cookEmail}`, 'new-order', {
          "message": "New order placed",
          "items": itemList,
          "customerEmail": customerEmail,
          "order": {
            "orderId": orderID,
            "orderAddress": orderAddress,
            "instructions": instructions,
            "orderedAt": Date.now(),
            "customerEmail": customerEmail,
            "cookEmail": cookEmail
          }
        });
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Order placed';
        o['orderId'] = orderID;
        res.send(o);
      }
    });
    connection.release();
  });

});

app.use('/setlocation', function (req, res, next) {
  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  const location = req.body['data']['location'];
  if (role === 'Homecook') {
    role = 'COOK';
  }
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET LOCATION = ' + location + ' WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400);
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

app.use('/getlocation', function (req, res, next) {
  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  if (role === 'Homecook') {
    role = 'COOK';
  }
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM USER WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'User does not exist!';
        res.send(o);
      }
      else {
        o['data'] = { 'location': rows[0].LOCATION };
        o['code'] = 200;
        res.status(200);
        res.send(o);
      }
      console.log(rows[0]);
    });
    connection.release();
  });
});

app.use('/logout', function (req, res, next) {
  const token = req.param('token');
  delete revLoginTokens[loginTokens[token]];
  delete loginTokens[token];
  res.status(200);
  res.send({ 'code': '200', 'message': 'Logout successful' });
});

app.use('/removefavoritehomecooks', function (req, res, next) {
  const cookEmail = req.body['data']['cookEmail'];
  const customerEmail = req.body['data']['customerEmail'];
  console.log("Reached remove");
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'DELETE from FAVORITE_HOMECOOKS where COOK_EMAIL=\'' + cookEmail + '\' AND CUSTOMER_EMAIL=\'' + customerEmail + '\';';
    console.log("Reached remove");
    connection.query(q, function (err, rows) {
      if (err) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'Remove failed';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Removed favorite homecook';
        res.send(o);
      }
      console.log(rows[0]);
      console.log("Reached remove");
    });
    connection.release();
  });
});


app.use('/removefavoritefood', function (req, res, next) {
  const email = req.body['data']['email'];
  const foodId = req.body['data']['food_id'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'DELETE from FAVORITE_FOOD where EMAIL=\'' + email + '\' AND FOOD_ID=\'' + foodId + '\';';
    connection.query(q, function (err, rows) {
      if (err) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'Remove failed';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'Removed favorite food';
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/getpastfoodcook', function (req, res, next) {
  let cookEmail = req.body['data']['email'];
  let o = {};
  con.getConnection(function (err, connection) {

    if (err) console.log(err);
    var q = 'SELECT FOOD.PICTURE, FOOD.FOOD_ID, USER1.EMAIL, FOOD.TITLE, FOOD.DESCRIPTION, FOOD.CUISINE, FOOD.PRICE, FOOD.CALORIES, FOOD.DELIVERY_TIME, USER1.FIRST_NAME, USER1.LAST_NAME FROM FOOD, USER AS USER1 WHERE USER1.EMAIL=FOOD.COOK_EMAIL AND USER1.ROLE=1 AND FOOD.COOK_EMAIL=\'' + cookEmail + '\' AND valid=\'true\'';

    console.log(q);
    connection.query(q, function (err, result) {
      console.log("Yo: " + result)
      if (err || result.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'No food offered now';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        for (var i = 0; i < result.length; i++) {
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
          ob['delivery_time'] = row.DELIVERY_TIME;
          if (ob['delivery_time'] === null) {
            ob['delivery_time'] = '2019-10-29 01:47:45';
          }
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        console.log(o);
        if (obj.length !== 0)
          res.send(o);

      }
      connection.release();
    });
  });
});


app.use('/getpastfood', function (req, res, next) {
  let email = req.body['data']['email'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) console.log(err);
    var q = 'SELECT DISTINCT FOOD.PICTURE, FOOD.FOOD_ID, USER1.EMAIL, FOOD.TITLE, FOOD.DESCRIPTION, FOOD.CUISINE, FOOD.PRICE, FOOD.CALORIES, FOOD.DELIVERY_TIME, USER1.FIRST_NAME, USER1.LAST_NAME, EXISTS(SELECT * FROM FAVORITE_FOOD WHERE FAVORITE_FOOD.FOOD_ID=FOOD.FOOD_ID AND FAVORITE_FOOD.EMAIL="' + email + '") AS IS_FAVORITE FROM FOOD, USER AS USER1, ORDERS, ORDER_FOOD WHERE USER1.EMAIL=ORDERS.COOK_EMAIL AND USER1.ROLE=1 AND ORDER_FOOD.ORDER_ID=ORDERS.ORDER_ID AND ORDER_FOOD.FOOD_ID=FOOD.FOOD_ID AND ORDERS.CUSTOMER_EMAIL="' + email + '";';
    console.log(q);
    connection.query(q, function (err, result) {
      if (err) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'No past food for this user';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          // console.log(row);
          ob['name'] = row.TITLE;
          ob['homecook'] = row.FIRST_NAME + " " + row.LAST_NAME;
          ob['email'] = row.COOK_EMAIL;
          ob['description'] = row.DESCRIPTION;
          ob['price'] = row.PRICE;
          ob['cuisine'] = row.CUISINE;
          ob['calories'] = row.CALORIES;
          ob['is_favorite'] = row.IS_FAVORITE;
          ob['picture'] = row.PICTURE;
          ob['food_id'] = row.FOOD_ID;
          ob['delivery_time'] = row.DELIVERY_TIME;
          if (ob['delivery_time'] === null) {
            ob['delivery_time'] = '2019-10-29 01:47:45';
          }
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        console.log(o);
        if (obj.length !== 0)
          res.send(o);

      }
      connection.release();
    });
  });
});


app.use('/getallfood', function (req, res, next) {
  let location = req.body['data']['location'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) console.log(err);
    var q = 'SELECT FOOD.PICTURE, FOOD_ID, COOK_EMAIL, TITLE, DESCRIPTION, CUISINE, PRICE, CALORIES, DELIVERY_TIME, FIRST_NAME, LAST_NAME FROM FOOD, USER WHERE FOOD.COOK_EMAIL=USER.EMAIL AND USER.online=1 AND USER.ROLE=1 AND (LOCATION BETWEEN ' + (parseInt(location) - 2) + ' AND ' + (parseInt(location) + 2) + ');';
    console.log(q);
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
        for (var i = 0; i < result.length; i++) {
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
          ob['delivery_time'] = row.DELIVERY_TIME;
          if (ob['delivery_time'] === null) {
            ob['delivery_time'] = '30';
          }
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        if (obj.length !== 0)
          res.send(o);

      }
      console.log("HOLA AMIGO")
      connection.release();
    });
  });
});

app.use('/getfooditems', function (req, res, next) {
  const email = req.body['data']['email'];
  console.log(email)
  let o = {};
  con.getConnection(function (err, connection) {
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
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          ob['name'] = row.TITLE;
          ob['price'] = row.PRICE;
          ob['cuisine'] = row.CUISINE;
          ob['calories'] = row.CALORIES;
          ob['picture'] = row.PICTURE;
          ob['email'] = row.COOK_EMAIL;
          ob['description'] = row.DESCRIPTION;
          ob['food_id'] = row.FOOD_ID;
          ob['delivery_time'] = row.DELIVERY_TIME;
          if (ob['delivery_time'] === null) {
            ob['delivery_time'] = '30';
          }
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o['data'] = obj;
        console.log(o);
        if (obj.length !== 0)
          res.send(o);

      }
      connection.release();
    });
  });
});


app.use('/gethomecooks', function (req, res, next) {
  // console.log(req.body)
  const email = req.body['data']['email'];
  let location = req.body['data']['location'];
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT PICTURE, FIRST_NAME, LAST_NAME, EMAIL, RATING, ABOUT_ME, EXISTS(SELECT * FROM FAVORITE_HOMECOOKS WHERE CUSTOMER_EMAIL="' + email + '" AND COOK_EMAIL=EMAIL) as IS_FAVORITE FROM USER, ROLES WHERE online=1 AND USER.ROLE=ROLES.ROLE_ID AND ROLE_DESC="COOK" AND (LOCATION BETWEEN ' + (parseInt(location) - 2) + ' AND ' + (parseInt(location) + 2) + ' AND ONLINE=1 );';
    connection.query(q, function (err, result) {
      if (err) console.log(err);
      if (result.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'No Homecooks in this region.. yet!';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        let cookEmail;
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          cookEmail = row.EMAIL;
          ob['name'] = row.FIRST_NAME + " " + row.LAST_NAME;
          ob['email'] = row.EMAIL;
          ob['rating'] = row.RATING;
          ob['aboutMe'] = row.ABOUT_ME;
          ob['isFavorite'] = row.IS_FAVORITE;
          ob['profilePicture'] = row.PICTURE;
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        // console.log(obj);
        o['data'] = obj;
        // console.log(o);
        if (obj.length !== 0)
          res.send(o);
      }
      connection.release();
    });
  });
});

app.use('/getallusers', function (req, res, next) {
  const page = parseInt(req.body['data']['page']);
  let role = req.body['data']['role'];
  const searchQuery = req.body['data']['searchQuery'];
  const start = (page - 1) * 10;
  const end = page * 10;
  if (role === 'Homecook') {
    role = 'COOK';
  }
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM USER WHERE ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '") AND (FIRST_NAME LIKE "%' + searchQuery + '%" OR EMAIL LIKE "%' + searchQuery + '%" OR LAST_NAME LIKE "%' + searchQuery + '%") ORDER BY FIRST_NAME, LAST_NAME LIMIT ' + start + ', ' + end + ';';
    connection.query(q, function (err, result) {
      if (err) console.log(err);
      if (result.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'No users found';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        let cookEmail;
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          cookEmail = row.EMAIL;
          ob['name'] = row.FIRST_NAME + " " + row.LAST_NAME;
          ob['email'] = row.EMAIL;
          ob['rating'] = row.RATING;
          ob['aboutMe'] = row.ABOUT_ME;
          ob['picture'] = row.PICTURE;
          ob['banStatus'] = row.BANNED;
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        // console.log(obj);
        o['data'] = obj;
        // console.log(o);
        if (obj.length !== 0)
          res.send(o);
      }
      connection.release();
    });
  });
});

app.use('/getnumberofusers', function (req, res, next) {
  let role = req.body['data']['role'];
  const searchQuery = req.body['data']['searchQuery'];
  if (role === 'Homecook') {
    role = 'COOK';
  }
  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT COUNT(*) AS numusers FROM USER WHERE ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '") AND (FIRST_NAME LIKE "%' + searchQuery + '%" OR EMAIL LIKE "%' + searchQuery + '%" OR LAST_NAME LIKE "%' + searchQuery + '%");';
    connection.query(q, function (err, result) {
      if (err) console.log(err);
      if (result.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'No users found';
        res.send(o);
      }
      else {
        let obj = [];
        let ob = {};
        let cookEmail;
        ob['numUsers'] = Math.ceil(result[0].numusers / 10);
        // console.log(obj);
        o['data'] = JSON.parse(JSON.stringify(ob));
        // console.log(o);
        if (ob)
          res.send(o);
      }
      connection.release();
    });
  });
});


app.use('/addfooditem', function (req, res, next) {
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
  const deliveryTime = req.body['data']['deliveryTime'];
  let o = {};
  // console.log(token)
  // console.log('insert into FoodItems values(\'' + itemName + '\', \'' + loginTokens[token] + '\', \'' + location + '\', \'' + price + '\', \'' + allergens +'\', \'' + cuisine + '\', \'' + calories +'\', \'' + picture + '\', \'' + desc + '\')')


  con.getConnection(function (err, connection) {
    console.log(allergens);
    if (err) console.log(err);
    let cuisine_present = false;
    if (cuisine != null) {
      var q = 'SELECT * FROM CUISINES WHERE CUISINE="' + cuisine + '";';
      console.log(q);
      connection.query(q, function (err, result) {
        if (err) console.log(err);
        if (result.length === 0) {
          cuisine_present = false;
        }
        else {
          cuisine_present = true;
        }
      });
    }
    if ((cuisine_present === false) && (cuisine_present != null)) {
      q = 'INSERT INTO CUISINES (CUISINE) VALUES ("' + cuisine + '");';
      console.log(q);
      connection.query(q, function (err, result) {
        console.log(cuisine_present);
        var columns = "(";
        var values = "(";
        if (itemName != null) {
          columns += "TITLE, ";
          values += '"' + itemName + '", ';
        }
        if (price != null) {
          columns += "PRICE, ";
          values += price + ", ";
        }
        if (cuisine != null) {
          columns += "CUISINE, ";
          values += '"' + cuisine + '", ';
        }
        if (calories != null) {
          columns += "CALORIES, ";
          values += calories + ", ";
        }
        if (deliveryTime != null) {
          columns += "DELIVERY_TIME, ";
          values += deliveryTime + ", ";
        }
        if (picture != null) {
          columns += "PICTURE, ";
          values += '"' + picture + '", ';
        }
        if (desc != null) {
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

        });
        for (var i = 0; i < allergens.length; i++) {
          var q = 'INSERT INTO FOOD_ALLERGEN (FOOD_ID, ALLERGEN) VALUES ("' + food_id + '", "' + allergens[i] + '");';
          connection.query(q, function (err, result) {
            if (err) console.log(err);
          });
        }
        connection.release();
      });
    }

  });
});




app.use('/editProfile', function (req, res, next) {

  const email = req.body['data']['email'];
  let role = req.body['data']['role'];
  const aboutMe = req.body['data']['aboutMe'];
  const name = req.body['data']['name'];
  const profilePicture = req.body['data']['profilePicture'];
  const firstName = name.toString().split(' ')[0];
  const lastName = name.toString().split(' ')[1];

  if (role === 'Homecook') role = 'COOK';

  if (firstName === null) {
    firstName = '';
  }
  if (lastName === null) {
    lastName = '';
  }
  if (aboutMe === null) {
    aboutMe = 'None';
  }
  if (profilePicture === null) {
    profilePicture = 'None';
  }
  if (name === null) {
    name = 'None';
  }

  let o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET ABOUT_ME="' + aboutMe + '", FIRST_NAME="' + firstName + '", LAST_NAME="' + lastName + '" , PICTURE="' + profilePicture + '" where EMAIL="' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
    connection.query(q, function (err, result) {
      if (err) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Update failed';
        console.log(err)
        res.send(o);
      } else {
        chatkit.updateUser({
          id: email,
          avatarURL: profilePicture
        })
          .then(res => {
            console.log("Chatkit user updated.");
          })
        o['code'] = 200;
        res.status(200)
        o['message'] = 'Successfully updated';
        res.send(o);
      }
      connection.release();
    });
  });
});

app.use('/profile', function (req, res, next) {
  let email = req.body['data']['email'];
  let role = req.body['data']['role'];
  if (role === 'Homecook') role = 'COOK';
  let o = {};
  con.getConnection(function (err, connection) {
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
        o['name'] = row.FIRST_NAME;
        if (row.LAST_NAME) {
          o['name'] += " ";
          o['name'] += row.LAST_NAME;
        }
        // o['name'] = row.FIRST_NAME + row.LAST_NAME;
        o['aboutMe'] = row.ABOUT_ME;
        o['cuisines'] = 'None';
        o['profilePicture'] = row.PICTURE;
        if (o['code'] !== 404)
          res.send(o);
      }
      connection.release();
    });
  });
});

app.use('/filter', function (req, res, next) {
  console.log('in filter')
  const json = req.body['data'];
  const cuisines = json['cuisines'];
  const allergenList = json['allergens'];
  var o = {};

  con.getConnection(function (err, connection) {
    if (err) console.log(err);
    var q = 'SELECT * FROM FOOD, FOOD_ALLERGEN, USER WHERE USER.EMAIL=FOOD.COOK_EMAIL AND FOOD.FOOD_ID=FOOD_ALLERGEN.FOOD_ID AND INSTR("' + cuisines + '",FOOD.CUISINE)>0 AND INSTR("' + allergenList + '",FOOD_ALLERGEN.ALLERGEN)=0';
    // var q = 'select * from FOOD, FOOD_ALLERGEN where FOOD.CUISNE like \'' + cuisines + '\' AND Allergen NOT LIKE \'' + allergenList + '\';';
    connection.query(q, function (err, result) {
      console.log(result);
      if (err) console.log(err);
      if (result.length === 0) {
        o['code'] = 400;
        res.status(400);
        o['message'] = 'No FoodItems available';
        res.send(o);
      } else {
        var ob = {};
        var obj = [];
        var row = result[0];
        for (let i = 0; i < result.length; i++) {
          row = result[i];
          ob['name'] = row.TITLE;
          ob['homecook'] = row.FIRST_NAME + " " + row.LAST_NAME;
          ob['email'] = row.COOK_EMAIL;
          ob['description'] = row.DESCRIPTION;
          ob['price'] = row.PRICE;
          ob['cuisine'] = row.CUISINE;
          ob['calories'] = row.CALORIES;
          ob['picture'] = row.PICTURE;
          ob['food_id'] = row.FOOD_ID;
          ob['delivery_time'] = row.DELIVERY_TIME;
          if (ob['delivery_time'] === null) {
            ob['delivery_time'] = '2019-10-29 01:47:45';
          }
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        console.log(obj);
        o['data'] = obj;
        o['code'] = 200;
        o['message'] = 'Filter results'
        res.status(200);
        res.send(o);
      }
    });
    connection.release();
  });
});

app.use('/forgotpassword', function (req, res, next) {
  const encEmail = req.body['data']['encEmail'];
  const email = req.body['data']['email'];
  const encPassword = req.body['data']['encPassword'];
  const password = req.body['data']['password'];
  console.log(email);
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET PASSWORD = "' + encPassword + '" WHERE EMAIL="' + encEmail + '";';
    connection.query(q, function (err, rows) {
      // 
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
app.use('/setstatus', function (req, res, next) {
  console.log("COMES TO STATUS")
  let email = req.body['data']['email'];
  let status = req.body['data']['status'];
  let role = req.body['data']['role'];
  if (role === "Homecook") role = "COOK"
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'UPDATE USER SET ONLINE = ' + status + ' WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");'; console.log(q);
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid cook';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'status updated';
        o['status'] = status;
        res.send(o);
      }
      console.log(rows[0]);
      connection.release();
    });

  });
});
app.use('/setfavoritehomecooks', function (req, res, next) {
  const email = req.body['data']['email'];
  const cookemail = req.body['data']['cook_email'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO FAVORITE_HOMECOOKS(COOK_EMAIL, CUSTOMER_EMAIL) VALUES ("' + cookemail + '", "' + email + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid cook';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'favorite cook added';
        res.send(o);
      }
      connection.release();
    });

  });
});


app.use('/setfavoritefood', function (req, res, next) {
  const email = req.body['data']['email'];
  const foodId = req.body['data']['food_id'];
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'INSERT INTO FAVORITE_FOOD(FOOD_ID, EMAIL) VALUES ("' + foodId + '", "' + email + '");';
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid food';
        res.send(o);
      }
      else {
        o['code'] = 200;
        res.status(200);
        o['message'] = 'favorite food added';
        res.send(o);
      }
      connection.release();
    });

  });
});


app.use('/getfavoritehomecooks', function (req, res, next) {

  const email = req.body['data']['email'];
  console.log(email)
  var o = {};
  con.getConnection(function (err, connection) {
    if (err) throw err;
    var q = 'SELECT * FROM USER A, (SELECT COOK_EMAIL FROM FAVORITE_HOMECOOKS WHERE CUSTOMER_EMAIL = "' + email + '") B WHERE A.EMAIL = B.COOK_EMAIL AND A.ROLE = 1';
    console.log(q);
    connection.query(q, function (err, rows) {
      if (err) throw err;
      if (rows.length === 0) {
        o['code'] = 400;
        res.status(400)
        o['message'] = 'Invalid cook';
        res.send(o);
      }
      else {
        obj = [];
        ob = {};
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          ob['email'] = r.EMAIL;
          ob['cook_name'] = r.FIRST_NAME + ' ' + r.LAST_NAME;
          if (r.ABOUT_ME !== null) {
            ob['cook_description'] = r.ABOUT_ME;
          }
          else {
            ob['cook_description'] = "";
          }
          if (r.ABOUT_ME !== null) {
            ob['cook_rating'] = r.ABOUT_ME;
          }
          else {
            ob['cook_rating'] = 3.5;
          }
          ob['cook_picture'] = r.PICTURE;
          obj.push(JSON.parse(JSON.stringify(ob)));
        }
        o = obj;
        o['code'] = 200;
        res.status(200);
        o['message'] = 'favorite cooks sent';
        res.send(o);
      }
      console.log(rows[0]);
      connection.release();
    });

  });
});


function sendEmail(email, password="", text, subject = 'Password Reset') {
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
app.use('/resetpassword', function (req, res, next) {
  const email = req.param['data']['email'];
  const oldPw = req.param['data']['oldPw'];
  const newPw = req.param['data']['newPw'];
  var o = {};

  con.getConnection(function (err, connection) {
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
        console.log(o);
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

        console.log(loginTokens);
        res.status(200);
        res.send(o);
      }
      connection.release();
    });
  });
});



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
      console.log(q);

      if (err) {
        console.log(err);
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
        sendEmail(email, password, s)
      }
      connection.release();
    });
  });
}

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