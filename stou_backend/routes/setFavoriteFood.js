var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    const foodId = req.body['data']['food_id'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'INSERT INTO FAVORITE_FOOD(FOOD_ID, EMAIL) VALUES ("' + foodId + '", "' + email + '");';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Invalid food';
                res.send(o);
            }
            else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'favorite food added';
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