var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let cookEmail = req.body['data']['cookEmail'];
    let numViews =  req.body['data']['numViews'];
    let q = 'UPDATE USER SET NUMVIEWS=' + numViews + ' WHERE EMAIL=\'' + cookEmail + '\' AND ROLE=1';
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'Cook Not Found';
                res.send(o);
            } else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Success';
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
