var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let location = req.body['data']['location'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT FOOD.PICTURE, FOOD_ID, COOK_EMAIL, TITLE, DESCRIPTION, CUISINE, PRICE, CALORIES, DELIVERY_TIME, FIRST_NAME, LAST_NAME FROM FOOD, USER WHERE FOOD.COOK_EMAIL=USER.EMAIL AND USER.online=1 AND USER.ROLE=1 AND (LOCATION BETWEEN ' + (parseInt(location) - 2) + ' AND ' + (parseInt(location) + 2) + ');';
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
            connection.release();
        });
    });
});

module.exports = router;
