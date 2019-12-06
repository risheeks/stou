var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const itemName = req.body['data']['itemName'];
    const cook_email = req.body['data']['homecook'];
    const food_id = uuidv4();
    const token = req.body['data']['token'];
    const location = req.body['data']['location'];
    const price = req.body['data']['price'];
    const allergens = req.body['data']['allergens'];
    const cuisine = req.body['data']['cuisine'];
    const calories = req.body['data']['calories'];
    const picture = req.body['data']['picture'];
    const desc = req.body['data']['description'];
    const deliveryTime = req.body['data']['deliveryTime'];
    let o = {};

    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        let cuisine_present = false;
        if (cuisine != null) {
            var q = 'SELECT * FROM CUISINES WHERE CUISINE="' + cuisine + '";';
            connection.query(q, function (err, result) {
                if (err) console.log(err);
                if (result.length === 0) {
                    cuisine_present = false;
                }
                else {
                    cuisine_present = true;
                }
            });
        }
        if ((cuisine_present === false) && (cuisine_present != null)) {
            q = 'INSERT INTO CUISINES (CUISINE) VALUES ("' + cuisine + '");';
            connection.query(q, function (err, result) {
                var columns = "(";
                var values = "(";
                if (itemName != null) {
                    columns += "TITLE, ";
                    values += '"' + itemName + '", ';
                }
                if (price != null) {
                    columns += "PRICE, ";
                    values += price + ", ";
                }
                if (cuisine != null) {
                    columns += "CUISINE, ";
                    values += '"' + cuisine + '", ';
                }
                if (calories != null) {
                    columns += "CALORIES, ";
                    values += calories + ", ";
                }
                if (deliveryTime != null) {
                    columns += "DELIVERY_TIME, ";
                    values += deliveryTime + ", ";
                }
                if (picture != null) {
                    columns += "PICTURE, ";
                    values += '"' + picture + '", ';
                }
                if (desc != null) {
                    columns += "DESCRIPTION, ";
                    values += '"' + desc + '", ';
                }
                columns += "FOOD_ID, VALID, ";
                values += '"' + food_id + '", "true", ';


                columns += "COOK_EMAIL) ";
                values += '"' + cook_email + '") ';

                q = 'INSERT INTO FOOD ' + columns + 'VALUES ' + values + ';';
                connection.query(q, function (err, result) {
                    if (err) {
                        o['code'] = 400;
                        res.status(400)
                        o['message'] = 'Failed to add food';
                        res.send(o);
                    }
                    else {
                        o['code'] = 200;
                        res.status(200)
                        o['message'] = itemName + ' added';
                        res.send(o);
                    }

                });
                for (var i = 0; i < allergens.length; i++) {
                    var q = 'INSERT INTO FOOD_ALLERGEN (FOOD_ID, ALLERGEN) VALUES ("' + food_id + '", "' + allergens[i] + '");';
                    connection.query(q, function (err, result) {
                        if (err) console.log(err);
                    });
                }
                con.releaseConnection(connection);
            });
        }

    });

    con.on('error', function () {
        res.status(500); res.send({'message' : 'Internal Server Error'});;
    })
});

module.exports = router;