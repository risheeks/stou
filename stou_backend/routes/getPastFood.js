var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let email = req.body['data']['email'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT DISTINCT FOOD.PICTURE, FOOD.FOOD_ID, USER1.EMAIL, FOOD.TITLE, FOOD.DESCRIPTION, FOOD.CUISINE, FOOD.PRICE, FOOD.CALORIES, FOOD.DELIVERY_TIME, USER1.FIRST_NAME, USER1.LAST_NAME, EXISTS(SELECT * FROM FAVORITE_FOOD WHERE FAVORITE_FOOD.FOOD_ID=FOOD.FOOD_ID AND FAVORITE_FOOD.EMAIL="' + email + '") AS IS_FAVORITE FROM FOOD, USER AS USER1, ORDERS, ORDER_FOOD WHERE USER1.EMAIL=ORDERS.COOK_EMAIL AND USER1.ROLE=1 AND ORDER_FOOD.ORDER_ID=ORDERS.ORDER_ID AND ORDER_FOOD.FOOD_ID=FOOD.FOOD_ID AND ORDERS.CUSTOMER_EMAIL="' + email + '";';
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
        res.status(500); res.send({'message' : 'Internal Server Error'});;
    })
});

module.exports = router;
