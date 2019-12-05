var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const customerEmail = req.body['data']['customerEmail'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        let q = 'SELECT * from ORDERS, USER where USER.EMAIL=ORDERS.COOK_EMAIL AND USER.ROLE=1 AND CUSTOMER_EMAIL="' + customerEmail + '" AND ORDERED_AT > "' + (Date.now() - 2419200000) + '" ORDER BY ORDERED_AT DESC;';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Invalid Cook';
                res.send(o);
                con.releaseConnection(connection);
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
                con.releaseConnection(connection);

            }
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;