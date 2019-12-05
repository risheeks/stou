var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    let role = req.body['data']['role'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT BANNED from USER where EMAIL=\'' + email + '\' AND ROLE=' + role + ');';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'User Not Found';
                res.send(o);
            } else {
                o['code'] = 200;
                res.status(200);
                o['data'] = { 'bannedStatus': rows[0].BANNED };
                o['message'] = 'Success';
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