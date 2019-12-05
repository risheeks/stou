var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let cookEmail = req.body['data']['cookEmail'];
    let q = 'SELECT * FROM FOOD JOIN (SELECT FOOD_ID, COUNT(*) AS ORDER_COUNT FROM ORDER_FOOD JOIN (SELECT * FROM ORDERS WHERE COOK_EMAIL=\'' + cookEmail + '\') AS NEW_ORDERS ON NEW_ORDERS.ORDER_ID=ORDER_FOOD.ORDER_ID GROUP BY FOOD_ID ORDER BY ORDER_COUNT LIMIT 1) AS FOOD_COUNTER ON FOOD_COUNTER.FOOD_ID=FOOD.FOOD_ID;';
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'Cook Not Found';
                res.send(o);
            } else {
                let ob = {};
                row = rows[0];
                ob['name'] = row.TITLE;
                ob['price'] = row.PRICE;
                ob['cuisine'] = row.CUISINE;
                ob['calories'] = row.CALORIES;
                ob['picture'] = row.PICTURE;
                ob['email'] = row.COOK_EMAIL;
                ob['description'] = row.DESCRIPTION;
                ob['food_id'] = row.FOOD_ID;
                ob['delivery_time'] = row.DELIVERY_TIME;
                o['data'] = ob;
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Success';
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
