var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    let role = req.body['data']['role'];
    let status = req.body['data']['status'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'UPDATE USER SET BANNED=' + status + ' WHERE EMAIL="' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
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
                o['message'] = 'Status changed successfully';
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