var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '888493',
    key: '244fae1265174aa1b9eb',
    secret: '2a96871bdc54e2e3629a',
    cluster: 'us2',
    encrypted: true
});
/* GET home page. */
router.use('/', function (req, res, next) {
    let email = req.body['data']['email'];
    let status = req.body['data']['status'];
    let role = req.body['data']['role'];
    if (role === "Homecook") role = "COOK"
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'UPDATE USER SET ONLINE = ' + status + ' WHERE EMAIL = "' + email + '" AND ROLE = (SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Invalid cook';
                res.send(o);
            }
            else {
                var q = `SELECT * FROM USER WHERE EMAIL="${email}";`;
                connection.query(q, function (err, newRows) {
                    if (err) throw err;
                    else if (status == 1) {
                        var q = 'SELECT CUSTOMER_EMAIL from FAVORITE_HOMECOOKS where COOK_EMAIL=\'' + email + '\';';
                        connection.query(q, function (err, rows) {
                            if (err) throw err;
                            if (rows.length === 0) {

                            }
                            else {
                                for (i = 0; i < rows.length; i++) {
                                    pusher.trigger(`customer-${rows[i].CUSTOMER_EMAIL}`, 'cook-online', {
                                        "message": "Favorite cook online",
                                        "cook": {
                                            "email": email,
                                            "name": newRows[0].FIRST_NAME + " " + newRows[0].LAST_NAME,
                                            "picture": newRows[0].PICTURE,
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
                connection.release();
                o['code'] = 200;
                res.status(200);
                o['message'] = 'status updated';
                o['status'] = status;
                res.send(o);
            }
        });

    });
});

module.exports = router;