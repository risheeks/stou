var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const encEmail = req.body['data']['encEmail'];
    const email = req.body['data']['email'];
    const encPassword = req.body['data']['encPassword'];
    const password = req.body['data']['password'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'UPDATE USER SET PASSWORD = "' + encPassword + '" WHERE EMAIL="' + encEmail + '";';
        connection.query(q, function (err, rows) {
            //
            if (err) {
                o['code'] = 404;
                res.status(404)
                o['message'] = 'Reset failed';
                res.send(o);
            } else {
                sendEmail(email, password, 'Here\'s your new password: ' + password);
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Password reset successfully';
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