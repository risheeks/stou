var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const json = req.body['data'];
    const cuisines = json['cuisines'];
    const allergenList = json['allergens'];
    var o = {};

    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT * FROM FOOD, FOOD_ALLERGEN, USER WHERE USER.EMAIL=FOOD.COOK_EMAIL AND FOOD.FOOD_ID=FOOD_ALLERGEN.FOOD_ID AND INSTR("' + cuisines + '",FOOD.CUISINE)>0 AND INSTR("' + allergenList + '",FOOD_ALLERGEN.ALLERGEN)=0';
        // var q = 'select * from FOOD, FOOD_ALLERGEN where FOOD.CUISNE like \'' + cuisines + '\' AND Allergen NOT LIKE \'' + allergenList + '\';';
        connection.query(q, function (err, result) {
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
                        ob['delivery_time'] = '2019-12-06 06:20:00';
                    }
                    obj.push(JSON.parse(JSON.stringify(ob)));
                }
                o['data'] = obj;
                o['code'] = 200;
                o['message'] = 'Filter results'
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