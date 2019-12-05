var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
    let email = req.body['data']['email'];
    var o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT * FROM USER WHERE EMAIL=\'' + email + '\' AND ROLE=2;';
        connection.query(q, function (err, rows) {
            if (err) throw err;
            if (rows.length === 0) {
                o['code'] = 202;
                res.status(202);
                let a = generatePromoCode();
                let text = 'App link, Enjoy 10% off on your order with this promo code ' + a;
                sendEmail(email, "", text, 'ENJOY STOU');
                o['message'] = 'Shared App Successfully';
                res.send(o);
            } else {
                o['code'] = 200;
                res.status(200);
                o['message'] = 'User already registered';
                res.send(o);
            }
            connection.release();
        });
    });
});

function generatePromoCode() {
    var o = {};
    let promoCode = uuidv4();
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'INSERT INTO PROMOCODES VALUES(\'' + promoCode.substring(0, 7) + '\', 0);';
        connection.query(q, function (err, rows) {
            if (err) throw err;
        });
        connection.release();
    });
    return promoCode.substring(0, 7);
}


function sendEmail(email, password = "", text, subject = 'Password Reset') {
    const nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'markvadesamuel1998@gmail.com',
            pass: 'soccermanager'
        }
    });

    var mailOptions = {
        from: 'markvadesamuel1998@gmail.com',
        to: email.toString(),
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = router;
