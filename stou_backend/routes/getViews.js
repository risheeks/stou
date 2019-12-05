var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let cookEmail = req.body['data']['cookEmail'];
    let q = 'SELECT * FROM USER WHERE EMAIL=\'' + cookEmail + '\' AND ROLE=1';
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'Cook Not Found';
                res.send(o);
            } else {
                o['data'] = rows[0].NUMVIEWS;
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Success';
                res.send(o);
            }
            connection.release();
        });
    });
});

module.exports = router;
