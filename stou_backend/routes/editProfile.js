var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
const Chatkit = require('@pusher/chatkit-server');
const instance_locator_id = 'v1:us1:16fd20fa-20b1-4bc1-9e3a-47adc4e2320b';
const chatkit_secret = 'f5fa044f-cc78-4874-8973-b4952bfcc68b:4+eZch6kWQ1gtBpqWtW8EpHsTKJ09frIR3ftWScTPes=';
const chatkit = new Chatkit.default({
    instanceLocator: instance_locator_id,
    key: chatkit_secret,
});
/* GET home page. */
router.use('/', function (req, res, next) {

    const email = req.body['data']['email'];
    let role = req.body['data']['role'];
    let aboutMe = req.body['data']['aboutMe'];
    let name = req.body['data']['name'];
    let profilePicture = req.body['data']['profilePicture'];
    let firstName = name.toString().split(' ')[0];
    let lastName = name.toString().split(' ')[1];

    if (role === 'Homecook') role = 'COOK';

    if (firstName === null) {
        firstName = '';
    }
    if (lastName === null) {
        lastName = '';
    }
    if (aboutMe === null) {
        aboutMe = 'None';
    }
    if (profilePicture === null) {
        profilePicture = 'None';
    }
    if (name === null) {
        name = 'None';
    }

    let o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'UPDATE USER SET ABOUT_ME="' + aboutMe + '", FIRST_NAME="' + firstName + '", LAST_NAME="' + lastName + '" , PICTURE="' + profilePicture + '" where EMAIL="' + email + '" AND ROLE=(SELECT ROLE_ID FROM ROLES WHERE ROLE_DESC="' + role + '");';
        connection.query(q, function (err, result) {
            if (err) {
                o['code'] = 400;
                res.status(400)
                o['message'] = 'Update failed';
                console.log(err)
                res.send(o);
            } else {
                chatkit.updateUser({
                    id: email,
                    avatarURL: profilePicture
                })
                    .then(res => {
                    })
                o['code'] = 200;
                res.status(200)
                o['message'] = 'Successfully updated';
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