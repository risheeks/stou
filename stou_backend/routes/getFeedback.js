var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT * FROM FEEDBACK';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'No feedback found';
                res.send(o);
            }
            else {
                let obList = [];
                var ob = {};
                for (i = 0; i < rows.length; i++) {
                    ob = { 'email': rows[i].EMAIL, 'feedback': rows[i].FEEDBACK };
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