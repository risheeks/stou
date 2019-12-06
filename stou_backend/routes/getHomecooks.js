var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connString = 'mysql://lSC9ZLcwnc:5SqWHLCVs5@remotemysql.com:3306/lSC9ZLcwnc?charset=utf8_general_ci&timezone=-0700';
var con = mysql.createPool(connString);
/* GET home page. */
router.use('/', function (req, res, next) {
        const email = req.body['data']['email'];
        let location = req.body['data']['location'];
        let o = {};
        con.getConnection(function (err, connection) {
            if (err) console.log(err);
            var q = 'SELECT NUMVIEWS,PICTURE, FIRST_NAME, LAST_NAME, EMAIL, RATING, ABOUT_ME, EXISTS(SELECT * FROM FAVORITE_HOMECOOKS WHERE CUSTOMER_EMAIL="' + email + '" AND COOK_EMAIL=EMAIL) as IS_FAVORITE FROM USER, ROLES WHERE online=1 AND USER.ROLE=ROLES.ROLE_ID AND ROLE_DESC="COOK" AND (LOCATION BETWEEN ' + (parseInt(location) - 2) + ' AND ' + (parseInt(location) + 2) + ' AND ONLINE=1 );';
            connection.query(q, function (err, result) {
                if (err) console.log(err);
                if (result.length === 0) {
                    o['code'] = 400;
                    res.status(400);
                    o['message'] = 'No Homecooks in this region.. yet!';
                    res.send(o);
                }
                else {
                    let obj = [];
                    let ob = {};
                    let cookEmail;
                    for (var i = 0; i < result.length; i++) {
                        var row = result[i];
                        cookEmail = row.EMAIL;
                        ob['name'] = row.FIRST_NAME + " " + row.LAST_NAME;
                        ob['email'] = row.EMAIL;
                        ob['rating'] = row.RATING;
                        ob['aboutMe'] = row.ABOUT_ME;
                        ob['isFavorite'] = row.IS_FAVORITE;
                        ob['profilePicture'] = row.PICTURE;
                        ob['numViews'] = row.NUMVIEWS;
                        if (ob['numViews'] === null) {
                            ob['numViews'] = 0;
                        }
                        obj.push(JSON.parse(JSON.stringify(ob)));
                    }
                    o['data'] = obj;
                    if (obj.length !== 0)
                        res.send(o);
                }
                connection.on('error', function () {
                   window.alert('aaaa')
                });
                con.releaseConnection(connection);
            });
        });
    con.on('error', function () {
        res.status(500); res.send({'message' : 'Internal Server Error'});;
    })
    });

module.exports = router;