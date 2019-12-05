var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
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
                if (obj.length !== 0)
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
