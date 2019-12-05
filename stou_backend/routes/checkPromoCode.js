var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let promoCode = req.body['data']['promoCode'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT * FROM PROMOCODES WHERE PROMO_CODE=\'' + promoCode + '\' AND STATUS=0;';
        console.log(q)
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'Promo Code Not Found';
                res.send(o);
            } else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Promo Code valid';
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
