var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let role = req.body['data']['role'];
    const searchQuery = req.body['data']['searchQuery'];
    if (role === 'Homecook') {
        role = 'COOK';
    }
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT COUNT(*) AS numusers FROM USER WHERE ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '") AND (FIRST_NAME LIKE "%' + searchQuery + '%" OR EMAIL LIKE "%' + searchQuery + '%" OR LAST_NAME LIKE "%' + searchQuery + '%");';
        connection.query(q, function (err, result) {
            if (err) console.log(err);
            if (result.length === 0) {
                o['code'] = 400;
                res.status(400);
                o['message'] = 'No users found';
                res.send(o);
            }
            else {
                let obj = [];
                let ob = {};
                let cookEmail;
                ob['numUsers'] = Math.ceil(result[0].numusers / 10);
                o['data'] = JSON.parse(JSON.stringify(ob));
                if (ob)
                    res.send(o);
            }
            connection.release();
        });
    });
});

module.exports = router;