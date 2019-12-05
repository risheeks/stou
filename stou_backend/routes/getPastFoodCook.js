var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let cookEmail = req.body['data']['email'];
    let o = {};
    con.getConnection(function (err, connection) {

        if (err) console.log(err);
        var q = 'SELECT FOOD.PICTURE, FOOD.FOOD_ID, USER1.EMAIL, FOOD.TITLE, FOOD.DESCRIPTION, FOOD.CUISINE, FOOD.PRICE, FOOD.CALORIES, FOOD.DELIVERY_TIME, USER1.FIRST_NAME, USER1.LAST_NAME FROM FOOD, USER AS USER1 WHERE USER1.EMAIL=FOOD.COOK_EMAIL AND USER1.ROLE=1 AND FOOD.COOK_EMAIL=\'' + cookEmail + '\' AND valid=\'true\'';

        connection.query(q, function (err, result) {
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
                        ob['delivery_time'] = '2019-12-06 06:30:00';
                    }
                    obj.push(JSON.parse(JSON.stringify(ob)));
                }
                o['data'] = obj;
                if (obj.length !== 0)
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
