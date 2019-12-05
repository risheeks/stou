var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
        let data = req.body['data']['data'];
        let role = req.body['data']['role'];
        let logFile;
        if (role === "Customer") logFile = "log/log_customer";
        else logFile = "log/log_cook"

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear();
        data = datetime.toString() + " - " + data.toString() + "\n";
        const fs = require('fs');
        var o = {};

            fs.appendFile(logFile, data, function (err) {
                if (err) {
                    o['code'] = 404;
                    res.status(404);
                    o['message'] = 'Cook Not Found';
                    res.send(o);
                    console.log(err);
                }
                console.log('Saved!');
                o['code'] = 200;
                res.status(200);
                o['message'] = 'Success';
                res.send(o);
            });
    });

module.exports = router;