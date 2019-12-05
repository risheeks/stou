var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    const role = req.body['data']['role'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT FIRST_NAME, LAST_NAME, RATING FROM USER WHERE EMAIL=\'' + email + '\' AND ROLE=' + role + ';';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'User Not Found';
                res.send(o);
            }
            else {
                let obList = [];

                let ob = {
                    'name': rows[0].FIRST_NAME + ' ' + rows[0].LAST_NAME,
                    'averageRating': rows[0].RATING
                };
                obList.push(ob);
                con.getConnection(function (err, nconnection) {
                    if (err) console.log(err);
                    var q = 'SELECT FIRST_NAME, LAST_NAME, REVIEW, ORDERS.COOK_RATING FROM ORDERS, USER WHERE CUSTOMER_EMAIL=EMAIL AND COOK_EMAIL=\'' + email + '\'AND COOK_RATING IS NOT NULL;'
                    nconnection.query(q, function (err, rows) {
                        if (err) console.log(err);
                        if (rows.length === 0) {
                            o['code'] = 404;
                            res.status(404);
                            o['message'] = 'No Reviews Found';
                            res.send(o);
                        }
                        else {
                            let tempList = [];
                            let tempOb = {};
                            for (i = 0; i < rows.length; i++) {
                                tempOb = {
                                    'customer': rows[i].FIRST_NAME + " " + rows[i].LAST_NAME,
                                    'review': rows[i].REVIEW,
                                    'rating': rows[i].COOK_RATING
                                };
                                if (rows[i].COOK_RATING !== null)
                                    tempList.push(tempOb);
                                tempOb = {};
                            }
                            obList.push(tempList);
                            o['data'] = obList;
                            o['code'] = 200;
                            res.status(200);
                            res.send(o);
                        }
                        con.releaseConnection(connection);
                    });
                });
            }
            con.releaseConnection(connection);
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;