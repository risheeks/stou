var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    const cookemail = req.body['data']['cook_email'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'INSERT INTO FAVORITE_HOMECOOKS(COOK_EMAIL, CUSTOMER_EMAIL) VALUES ("' + cookemail + '", "' + email + '");';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Invalid cook';
                res.send(o);
            }
            else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'favorite cook added';
                res.send(o);
            }
            connection.release();
        });

    });
});

module.exports = router;