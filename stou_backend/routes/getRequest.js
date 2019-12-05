var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    const email = req.body['data']['email'];
    const role = req.body['data']['role'];
    let q = '';
    if (role === 1) {
        q = 'SELECT * FROM REQUESTS WHERE COOK_EMAIL=\'' + email + '\'';
    } else {
        q = 'SELECT * FROM REQUESTS WHERE CUSTOMER_EMAIL=\'' + email + '\'';
    }
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'User Not Found';
                res.send(o);
            }
            else {
                let obList = [];
                var ob = {};
                for (i = 0; i < rows.length; i++) {
                    ob = { 'requestId': rows[i].REQUEST_ID, 'cookEmail': rows[i].COOK_EMAIL, 'customerEmail': rows[i].CUSTOMER_EMAIL, 'itemName': rows[i].ITEM_NAME, 'itemDescription': rows[i].ITEM_DESCRIPTION, 'status': rows[i].STATUS };
                    obList.push(ob);
                    ob = {};
                }
                o['data'] = obList;
                o['code'] = 200;
                res.status(200);
                res.send(o);
            }
            connection.release();
        });
    });
});

module.exports = router;