# Stou Backend Documentation 

<b>Overview</b>


    The backend for Stou is comprised of a MySql database and a Node.js Express server 
    that provides endpoints to receive HTTP requests and responds to them. The server handles POST, GET, PUT, DELETE requests. 

<b>Usage</b>


    The server can be run using the command ‘node app.js’ locally and will by default use port 5000 to host. 
    You need to have node installed, along with all the npm dependencies mentioned in package.json

<b>Hosting</b>

    The server is also hosted on heroku, at the URL stouserver.herokuapp.com.

<b>Logs</b>

    The backend also logs all HTTP requests with other metadata about the request in a file called ‘access.log’ in the log/ directory sorted by day.
    
<b>Database </b>

    The database is a MySql relational database and is hosted remotely with remoteSql and phpMyAdmin. The SQL script create_tables.sql can be used to sanitize the database to drop tables and reinitialize the database. 
    URL: https://remotemysql.com/phpmyadmin/sql.php?server=1&db=lSC9ZLcwnc



<b>Folder Structure</b>

    .
    |---- stou_backend
    |     |---- log
    |     |      |---- access.log
    |     |      |---- log_cook
    |     |      |---- log_customer
    |     |---- routes
    |     |      |---- addFoodItem.js
    |     |      |---- addRequest.js
    |     |      |---- changebanStatus.js
    |     |      |---- changeRequestStatus.js
    |     |      |---- checkPromoCode.js
    |     |      |---- editProfile.js
    |     |      |---- filter.js
    |     |      |---- forgotPassword.js
    |     |      |---- getAllFood.js
    |     |      |---- getAllOrders.js
    |     |      |---- getAllUsers.js
    |     |      |---- getBanStatus.js
    |     |      |---- getCustomerOrders.js
    |     |      |---- getCustomersFollowingHomecooks.js
    |     |      |---- getDetailsByOrder.js
    |     |      |---- getFavoriteHomecooks.js
    |     |      |---- getFeedback.js
    |     |      |---- getFoodItems.js
    |     |      |---- getFoodItemsByOrder.js
    |     |      |---- getHomecooks.js
    |     |      |---- getLocation.js
    |     |      |---- getNumberOfUsers.js
    |     |      |---- getPastFood.js
    |     |      |---- getPastFoodCook.js
    |     |      |---- getRecentOrders.js
    |     |      |---- getRequest.js
    |     |      |---- getReviewRating.js
    |     |      |---- getRoomId.js
    |     |      |---- getStatus.js
    |     |      |---- getTopFood.js
    |     |      |---- getViews.js
    |     |      |---- placeOrder.js
    |     |      |---- getProfile.js
    |     |      |---- removeFavoriteFood.js
    |     |      |---- removeFavoriteHomecooks.js
    |     |      |---- resetPassword.js
    |     |      |---- setFavoriteFood.js
    |     |      |---- setFavoriteHomecooks.js
    |     |      |---- setFeedback.js
    |     |      |---- setLocation.js
    |     |      |---- setOrderStatus.js
    |     |      |---- setReviewRating.js
    |     |      |---- setStatus.js
    |     |      |---- setViews.js
    |     |      |---- shareApp.js
    |     |      |---- usePromoCode.js
    |---- app.js
    |---- .gitignore
    |---- package-lock.json
    |---- package.json
    |---- create_tables.sql
    |---- README.md

<b>Server Endpoints</b>
    
Add Food Item for Cook
    
    URL : /addFoodItem

Add Request for Cook

    URL : /addRequests

Change Ban Status

    URL : /changeBanStatus

Check Promo Code

    URL : /checkPromoCode

Edit Profile

    URL : /editProfile

Filter Food Items

    URL : /filter

Forgot Password

    URL : /forgotPassword

Show All Food by Location

    URL : /getAllFood

Get All Orders for Cook

    URL : /getAllOrders

Get All Users by Role

    URL : /getAllusers

Get Ban Status

    URL : /getBanStatus

Get All Orders for Customer

    URL : /getCustomerOrders

Get Customers Following Homecook

    URL : /getCustomersFollowingHomecook

Get Details by Order

    URL : /getDetailsByOrder

Get Favorite Homecooks

    URL : /getFavoritehomecooks

Get All Feedback

    URL : /getFeedback

Get Food Items Offered By Cook

    URL : /getFoodItems

Get Food Items Offered By Order

    URL : /getFoodItems

Get Homecooks by Location

    URL : /getFoodItems

Get Location by Email

    URL : /getFoodItems

Get Number of Users

    URL : /getNumberOfUsers

Get Past Food By Customer

    URL : /getPastFood

Get Recent Orders by Customer

    URL : /getPastFood

Get Requested Food by Role

    URL : /getRequest

Get Reviews and Rating by Role

    URL : /getReviewRating

Get Reviews and Rating by Role

    URL : /getReviewRating

Get Room Id

    URL : /getRoomId

Get Online Status by Cook

    URL : /getStatus

Get Top Food by Cook

    URL : /getTopFood

Get Views by Cook

    URL : /getViews

Place an Order

    URL : /placeOrder

Get Profile

    URL : /getProfile

Remove Favorite Food by Customer

    URL : /removeFavoriteFood

Remove Favorite Homecook by Customer

    URL : /removeFavoritehomecook

Reset Password

    URL : /resetPassword

Set Favorite Food for Customer

    URL : /setFavoriteFood
    
Set Favorite Homecooks for Customer

    URL : /setFavoriteHomecooks

Send Feedback to Stou

    URL : /setFeedback

Set Location by User
    
    URL : /setLocation
    
Set Order Status

    URL : /setOrderStatus

Set Review Rating for Cook

    URL : /setReviewRating

Set Online Status by Cook

    URL : /setStatus

Set Views for Cook Profile

    URL : /setViews

Share App 

    URL : /shareApp

Use Promo Code

    URL : /usePromoCode

	

