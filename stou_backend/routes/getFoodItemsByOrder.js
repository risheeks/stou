var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
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
            connection.release();
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;