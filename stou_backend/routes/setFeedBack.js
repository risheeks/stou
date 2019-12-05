var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    let feedback = req.body['data']['feedback'];

    let o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'INSERT INTO FEEDBACK VALUES (\'' + email + '\', \'' + feedback + '\');';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 500;
                res.status(500);
                o['message'] = 'Internal Server Error';
                res.send(o);
            }
            else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Feedback added';
                res.send(o);
            }
            connection.release();
        });
    });
});

module.exports = router;