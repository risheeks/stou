var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '888493',
    key: '244fae1265174aa1b9eb',
    secret: '2a96871bdc54e2e3629a',
    cluster: 'us2',
    encrypted: true
});
const uuidv4 = require('uuid/v4');

/* GET home page. */
router.use('/', function (req, res, next) {
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

    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'Insert into ORDERS (ORDER_ID, ORDERED_AT, COOK_EMAIL, CUSTOMER_EMAIL, INSTRUCTIONS, DELIVERY_TIME, ORDER_ADDRESS, ORDER_STATUS, PAYMENT_KEY) values("' + orderID + '", "' + Date.now() + '", "' + cookEmail + '", "' + customerEmail + '", "' + instructions + '", ' + deliveryTime + ', "' + orderAddress + '", "' + orderStatus + '", "' + paymentId + '");';
        connection.query(q, function (err, rows) {
            if (err) throw err;

            else {
                for (let i = 0; i < itemList.length; i++) {
                    con.getConnection(function (err, connection) {
                        if (err) throw err;
                        console.log(itemList[i]);
                        var q = 'Insert into ORDER_FOOD (ORDER_ID, FOOD_ID, QUANTITY, PRICE) values(\'' + orderID + '\', \'' + itemList[i].food_id + '\', ' + itemList[i].quantity + ', ' + itemList[i].price + ');';
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
            connection.release();
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;