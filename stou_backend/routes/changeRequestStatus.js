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
    const requestId = req.body['data']['requestId'];
    const cookEmail = req.body['data']['cookEmail'];
    const customerEmail = req.body['data']['customerEmail'];
    const itemName = req.body['data']['itemName'];
    const status = req.body['data']['status'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        var q = 'UPDATE REQUESTS SET STATUS=' + status + ' WHERE REQUEST_ID=\'' + requestId + '\';';
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 500;
                res.status(500);
                o['message'] = 'Internal Server Error';
                res.send(o);
            }
            else {
                var q = `SELECT * FROM USER WHERE EMAIL="${cookEmail}" AND ROLE=1;`;
                connection.query(q, function (err, newRows) {
                    console.log(newRows);
                    pusher.trigger('customer-' + customerEmail, 'request-update', {
                        "message": "Request Accepted",
                        "request_item": {
                            "email": cookEmail,
                            "name": itemName,
                            "status": status,
                            "cookName": newRows[0].FIRST_NAME + ' ' + newRows[0].LAST_NAME,
                            "picture": newRows[0].PICTURE
                        }
                    });
                    con.releaseConnection(connection);
                });
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Status changed';
                res.send(o);
            }
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;