var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    let role = req.body['data']['role'];
    if (role === 'Homecook') {
        role = 'COOK';
    }
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT * FROM USER WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400);
                o['message'] = 'User does not exist!';
                res.send(o);
            }
            else {
                o['data'] = { 'location': rows[0].LOCATION };
                o['code'] = 200;
                res.status(200);
                res.send(o);
            }
            connection.release();
        });
    });
});

module.exports = router;