var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.param['data']['email'];
    const oldPw = req.param['data']['oldPw'];
    const newPw = req.param['data']['newPw'];
    var o = {};

    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'UPDATE USER SET PASSWORD = "' + newPw + '" WHERE EMAIL="' + email + '" AND PASSWORD="' + oldPw + '";';
        connection.query(q, function (err, rows) {
            if (err) {
                o['code'] = 400;
                res.status(400);
                o['message'] = 'Reset failed';
                res.send(o);
            } else {
                o['code'] = 200;
                res.status(200)
                o['message'] = 'Password reset successfully';
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