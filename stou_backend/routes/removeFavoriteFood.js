var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    const foodId = req.body['data']['food_id'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'DELETE from FAVORITE_FOOD where EMAIL=\'' + email + '\' AND FOOD_ID=\'' + foodId + '\';';
        connection.query(q, function (err, rows) {
            if (err) {
                o['code'] = 400;
                res.status(400);
                o['message'] = 'Remove failed';
                res.send(o);
            }
            else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Removed favorite food';
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
