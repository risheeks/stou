var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const page = parseInt(req.body['data']['page']);
    let role = req.body['data']['role'];
    const searchQuery = req.body['data']['searchQuery'];
    const start = (page - 1) * 10;
    const end = page * 10;
    if (role === 'Homecook') {
        role = 'COOK';
    }
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT * FROM USER WHERE ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '") AND (FIRST_NAME LIKE "%' + searchQuery + '%" OR EMAIL LIKE "%' + searchQuery + '%" OR LAST_NAME LIKE "%' + searchQuery + '%") ORDER BY FIRST_NAME, LAST_NAME LIMIT ' + start + ', ' + end + ';';
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
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    cookEmail = row.EMAIL;
                    ob['name'] = row.FIRST_NAME + " " + row.LAST_NAME;
                    ob['email'] = row.EMAIL;
                    ob['rating'] = row.RATING;
                    ob['aboutMe'] = row.ABOUT_ME;
                    ob['picture'] = row.PICTURE;
                    ob['banStatus'] = row.BANNED;
                    obj.push(JSON.parse(JSON.stringify(ob)));
                }
                o['data'] = obj;
                if (obj.length !== 0)
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