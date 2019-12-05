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
    const orderId = req.body['data']['orderId'];
    const newOrderStatus = req.body['data']['orderStatus'];
    let o = {};
    con.getConnection(function (err, connection) {
        if (err) throw err;
        var q = 'SELECT * from ORDERS where ORDER_ID=\'' + orderId + '\';';
        connection.query(q, function (err, rows) {
            if (err || rows.length === 0) {
                o['code'] = 400;
                res.status(400);
                o['message'] = 'Invalid Order';
                res.send(o);
            } else {
                const currentOrderStatus = rows[0].ORDER_STATUS;
                const customerEmail = rows[0].CUSTOMER_EMAIL;
                const cookEmail = rows[0].COOK_EMAIL;
                let update = false;
                if (newOrderStatus === 'in_progress' && currentOrderStatus === 'placed') {
                    update = true;
                } else if (newOrderStatus === 'on_the_way' && currentOrderStatus === 'in_progress') {
                    update = true;
                } else if (newOrderStatus === 'delivered' && currentOrderStatus === 'on_the_way') {
                    update = true;
                } else if (currentOrderStatus !== 'delivered' && newOrderStatus === 'cancelled') {
                    update = true;
                } else if (currentOrderStatus === 'placed' && newOrderStatus === 'declined') {
                    update = true;
                }
                else if (currentOrderStatus !== 'delivered' && currentOrderStatus !== 'on_the_way' && newOrderStatus === 'request_cancel') {
                    update = true;
                }
                if (update) {
                    con.getConnection(function (err, connection) {
                        if (err) throw err;
                        var q = 'UPDATE ORDERS SET ORDER_STATUS=\'' + newOrderStatus + '\' where ORDER_ID=\'' + orderId + '\';';
                        connection.query(q, function (err, newRows) {
                            if (err) {
                                o['code'] = 400;
                                res.status(400);
                                o['message'] = 'Failed to update status';
                                res.send(o);
                            } else {
                                if (currentOrderStatus === 'placed' && newOrderStatus === 'in_progress') {
                                    chatkit.addUsersToRoom({
                                        roomId: customerEmail + "-" + cookEmail,
                                        userIds: [cookEmail, customerEmail],
                                    })
                                }
                                if (newOrderStatus === 'delivered') {
                                    var q = `SELECT * FROM ORDERS WHERE COOK_EMAIL="${cookEmail}" AND CUSTOMER_EMAIL="${customerEmail}" AND ORDER_STATUS NOT IN("delivered", "cancelled") AND ORDER_ID != "${orderId}";`;
                                    connection.query(q, function (err, nRows) {
                                        console.log(nRows[0])
                                        if (nRows.length < 1) {
                                            chatkit.removeUsersFromRoom({
                                                roomId: customerEmail + "-" + cookEmail,
                                                userIds: [cookEmail, customerEmail],
                                            })
                                        }
                                    });
                                }
                                pusher.trigger(`customer-${customerEmail}`, 'order-update', {
                                    "message": "Order status changed",
                                    "order": {
                                        "orderId": orderId,
                                        "orderStatus": newOrderStatus,
                                        "name": rows[0].FIRST_NAME + " " + rows[0].LAST_NAME,
                                        "orderedAt": rows[0].ORDERED_AT,
                                        "orderAddress": rows[0].ORDER_ADDRESS,
                                        "rating": rows[0].RATING
                                    }
                                });
                                o['code'] = 200;
                                res.status(200);
                                o['message'] = 'Status update successful';
                                res.send(o);
                            }
                            connection.release();
                        });
                    });
                }
                else {
                    o['code'] = 400;
                    res.status(400);
                    o['message'] = 'Invalid Status Update';
                    res.send(o);
                }
            }
            connection.release();
        });
    });
    con.on('error', function () {
        console.log('Too many users');
    })
});

module.exports = router;