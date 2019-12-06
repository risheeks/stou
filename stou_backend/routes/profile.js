var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let email = req.body['data']['email'];
    let role = req.body['data']['role'];
    if (role === 'Homecook') role = 'COOK';
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT * FROM USER WHERE EMAIL= "' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
        connection.query(q, function (err, result) {
            if (err) console.log(err);
            if (result.length === 0) {
                o['code'] = 404;
                res.status(404)
                o['message'] = 'User not found';
                res.send(o);
            }
            else {
                var row = result[0];
                o['name'] = row.FIRST_NAME;
                if (row.LAST_NAME) {
                    o['name'] += " ";
                    o['name'] += row.LAST_NAME;
                }
                // o['name'] = row.FIRST_NAME + row.LAST_NAME;
                o['aboutMe'] = row.ABOUT_ME;
                o['cuisines'] = 'None';
                o['profilePicture'] = row.PICTURE;
                if (o['code'] !== 404)
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