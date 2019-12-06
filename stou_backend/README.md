Stou Backend Documentation


Overview
The backend for Stou is comprised of a MySql database and a Node.js Express server that provides endpoints to receive HTTP requests and responds to them. The server handles POST, GET, PUT, DELETE requests. 

Usage
The server can be run using the command ‘node app.js’ locally and will by default use port 5000 to host. You need to have node installed, along with all the npm dependencies mentioned in package.json

Hosting
The server is also hosted on heroku, at the URL stouserver.herokuapp.com.

Logs
The backend also logs all HTTP requests with other metadata about the request in a file called ‘access.log’ in the log/ directory sorted by day.
Server Endpoints
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

Database 

The database is a MySql relational database and is hosted remotely with remoteSql and phpMyAdmin. The SQL script create_tables.sql can be used to sanitize the database to drop tables and reinitialize the database. 
URL: https://remotemysql.com/phpmyadmin/sql.php?server=1&db=lSC9ZLcwnc


