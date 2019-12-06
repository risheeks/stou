var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let email = req.body['data']['email'];
    let role = req.body['data']['role']
    var o = {};
    let q = "";
    if (role === 1) {
        q = 'SELECT CUSTOMER_EMAIL, COOK_EMAIL FROM ORDERS WHERE COOK_EMAIL=\'' + email + '\';';
    } else {
        q = 'SELECT CUSTOMER_EMAIL, COOK_EMAIL FROM ORDERS WHERE CUSTOMER_EMAIL=\'' + email + '\';';
    }

    con.getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q, function (err, rows) {
            if (err) console.log(err);
            if (rows.length === 0) {
                o['code'] = 404;
                res.status(404);
                o['message'] = 'No Orders Found';
                res.send(o);
            } else {
                let idSet = new Set();
                for (i = 0; i < rows.length; i++) {
                    idSet.add(rows[i].CUSTOMER_EMAIL + "-" + rows[i].COOK_EMAIL);
                }
                o['data'] = Array.from(idSet.values())
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Success';
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
