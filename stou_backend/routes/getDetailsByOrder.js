var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    // console.log(req.body['data'])
    const orderId = req.body['data']['orderId'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT * from ORDERS, USER where USER.EMAIL=ORDERS.COOK_EMAIL and USER.ROLE=1 and ORDER_ID=\'' + orderId + '\';';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Invalid Order';
                res.send(o);
            } else {
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
            con.releaseConnection(connection);
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;