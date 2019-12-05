var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {

    const email = req.body['data']['email'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT * FROM USER A, (SELECT COOK_EMAIL FROM FAVORITE_HOMECOOKS WHERE CUSTOMER_EMAIL = "' + email + '") B WHERE A.EMAIL = B.COOK_EMAIL AND A.ROLE = 1';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Invalid cook';
                res.send(o);
            }
            else {
                obj = [];
                ob = {};
                for (var i = 0; i < rows.length; i++) {
                    var r = rows[i];
                    ob['email'] = r.EMAIL;
                    ob['cook_name'] = r.FIRST_NAME + ' ' + r.LAST_NAME;
                    if (r.ABOUT_ME !== null) {
                        ob['cook_description'] = r.ABOUT_ME;
                    }
                    else {
                        ob['cook_description'] = "";
                    }
                    if (r.ABOUT_ME !== null) {
                        ob['cook_rating'] = r.ABOUT_ME;
                    }
                    else {
                        ob['cook_rating'] = 3.5;
                    }
                    ob['cook_picture'] = r.PICTURE;
                    obj.push(JSON.parse(JSON.stringify(ob)));
                }
                o = obj;
                o['code'] = 200;
                res.status(200);
                o['message'] = 'favorite cooks sent';
                res.send(o);
            }
            connection.release();
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;