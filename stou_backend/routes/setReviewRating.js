var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    let rating = req.body['data']['rating'];
    let role = req.body['data']['role'];
    let orderId = req.body['data']['orderId'];
    let review = req.body['data']['review'];

    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = '';
        if (role === 1) {
            q = 'UPDATE ORDERS SET REVIEW=\'' + review + '\', COOK_RATING=' + rating + ' WHERE ORDER_ID=\'' + orderId + '\';';
        }
        else if (role === 2) {
            q = 'UPDATE ORDERS SET CUSTOMER_RATING=' + rating + ' WHERE ORDER_ID=\'' + orderId + '\';';
        }
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'Order Not Found';
                res.send(o);
            }
            con.releaseConnection(connection);
        });
    });

    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'SELECT RATING, NUMRATINGS from USER where EMAIL=\'' + email + '\' AND ROLE=' + role + ';';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'User Not Found';
                res.send(o);
            }
            else {
                let currentRating = 0;
                let numRatings = 0;
                if (rows[0].RATING !== null) {
                    currentRating = rows[0].RATING;
                }
                if (rows[0].NUMRATINGS !== null) {
                    numRatings = rows[0].NUMRATINGS;
                }
                let newRating = ((parseFloat(currentRating) * parseInt(numRatings)) + parseFloat(rating)) / parseInt(numRatings + 1);
                con.getConnection(function (err, connection) {
                    if (err) console.log(err);
                    var q = 'UPDATE USER SET RATING=' + newRating + ', NUMRATINGS=' + (numRatings + 1) + ' WHERE EMAIL=\'' + email + '\' AND ROLE=' + role + ';';
                    connection.query(q, function (err, rows) {
                        if (err) console.log(err);
                        if (rows.length === 0) {
                            o['code'] = 500;
                            res.status(500);
                            o['message'] = 'Internal Server Error';
                            res.send(o);
                        }
                        else {
                            o['code'] = 200;
                            res.status(200);
                            o['message'] = 'Rating updated';
                            res.send(o);
                        }
                        con.releaseConnection(connection);
                    });
                });
            }
        });
        con.releaseConnection(connection);
    });
    con.on('error', function () {
        res.status(500); res.send({'message' : 'Internal Server Error'});;
    })
});


module.exports = router;