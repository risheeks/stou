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
    const requestId = uuidv4();
    const cookEmail = req.body['data']['cookEmail'];
    const customerEmail = req.body['data']['customerEmail'];
    const itemName = req.body['data']['itemName'];
    const itemDescription = req.body['data']['itemDescription'];

    let o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'INSERT INTO REQUESTS VALUES (\'' + cookEmail + '\', \'' + customerEmail + '\', \'' + itemName + '\', \'' + itemDescription + '\', 0,\'' + requestId + '\');';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 500;
                res.status(500);
                o['message'] = 'Internal Server Error';
                res.send(o);
            }
            else {
                pusher.trigger('cook-' + cookEmail, 'request_added', {
                    "message": "New Request",
                    "request_item": {
                        "requestId": requestId,
                        "cookEmail": cookEmail,
                        "customerEmail": customerEmail,
                        "name": itemName,
                        "description": itemDescription
                    }
                });
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Request added';
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