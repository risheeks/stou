stou

Links -->   http://stoucook.herokuapp.com
            http://stoufood.herokuapp.com

STOU_ADMIN_FRONTEND

Folder Structure

    .
    |---- src
    |     |---- actions
    |     |      |---- login.action.js
    |     |      |---- modal.action.js
    |     |---- components
    |     |      |---- Chat
    |     |      |      |---- index.js
    |     |      |      |---- Maximized.js
    |     |      |      |---- Message.js
    |     |      |      |---- MessageList.js
    |     |      |      |---- Minimized.js
    |     |      |      |---- RoomList.js
    |     |      |      |---- SendMessageForm.js
    |     |      |---- Common
    |     |      |      |---- Header
    |     |      |      |      |---- index.js
    |     |      |      |---- Modals
    |     |      |      |      |---- BanProfileModal.js
    |     |      |      |      |---- ChatHistory.js
    |     |      |      |      |---- index.js
    |     |      |      |      |---- MessageListModal.js
    |     |      |      |---- CustomeRating.js
    |     |      |---- Feedback
    |     |      |      |---- index.js
    |     |      |---- Home
    |     |      |      |---- index.js
    |     |      |---- Main
    |     |      |      |---- index.js
    |     |      |---- UserList
    |     |      |      |---- index.js
    |     |---- config
    |     |      |---- index.js
    |     |---- constants
    |     |      |---- images
    |     |      |---- sounds
    |     |      |---- index.js
    |     |      |---- ModalKeys.js
    |     |---- reducers
    |     |      |---- index.js
    |     |      |---- login.reducer.js
    |     |      |---- modal.reducer.js
    |     |---- styles
    |     |      |---- Main.css
    |     |---- App.css
    |     |---- App.js
    |     |---- App.test.js
    |     |---- index.css
    |     |---- index.js
    |     |---- logo.svg
    |     |---- serviceWorker.js
    |---- .env.development
    |---- .env.production
    |---- .gitignore
    |---- package-lock.json
    |---- package.json
    |---- yarn.lock
    |---- README.md




Setting Up

    Install node and react using brew

    Install required modules
    npm install




Running the app in development

    npm start





STOU_COOK_FRONTEND

Folder Structure

    .
    |---- src
    |     |---- actions
    |     |      |---- login.action.js
    |     |      |---- modal.action.js
    |     |---- components
    |     |      |---- AddFoodItem
    |     |      |      |---- index.js
    |     |      |---- Chat
    |     |      |      |---- index.js
    |     |      |      |---- Maximized.js
    |     |      |      |---- Message.js
    |     |      |      |---- MessageList.js
    |     |      |      |---- Minimized.js
    |     |      |      |---- RoomList.js
    |     |      |      |---- SendMessageForm.js
    |     |      |---- Common
    |     |      |      |---- Header
    |     |      |      |      |---- index.js
    |     |      |      |---- Modals
    |     |      |      |      |---- BanProfileModal.js
    |     |      |      |      |---- ChatHistory.js
    |     |      |      |      |---- index.js
    |     |      |      |      |---- MessageListModal.js
    |     |      |      |---- CustomeRating.js
    |     |      |---- Home
    |     |      |      |---- index.js
    |     |      |---- Login
    |     |      |      |---- index.js
    |     |      |---- Main
    |     |      |      |---- index.js
    |     |      |---- OnlineStatus
    |     |      |      |---- index.js
    |     |      |---- Orders
    |     |      |      |---- index.js
    |     |      |---- PrivacyPolicy
    |     |      |      |---- index.js
    |     |      |      |---- index.css
    |     |      |      |---- subBody01.js
    |     |      |      |---- subBody02.js
    |     |      |      |---- subBody03.js
    |     |      |      |---- subBody04.js
    |     |      |---- Profile
    |     |      |      |---- index.js
    |     |      |---- Register
    |     |      |      |---- index.js
    |     |      |---- Requests
    |     |      |      |---- index.js
    |     |      |---- ResetPassword
    |     |      |      |---- index.js
    |     |---- config
    |     |      |---- index.js
    |     |---- constants
    |     |      |---- images
    |     |      |---- sounds
    |     |      |---- index.js
    |     |      |---- ModalKeys.js
    |     |---- reducers
    |     |      |---- index.js
    |     |      |---- login.reducer.js
    |     |      |---- modal.reducer.js
    |     |---- styles
    |     |      |---- Main.css
    |     |---- App.css
    |     |---- App.js
    |     |---- App.test.js
    |     |---- index.css
    |     |---- index.js
    |     |---- logo.svg
    |     |---- serviceWorker.js
    |---- .env.development
    |---- .env.production
    |---- .gitignore
    |---- package-lock.json
    |---- package.json
    |---- yarn.lock
    |---- README.md



Setting Up

    Install required modules
    npm install
    


Running the app in development

    npm start





STOU_CUSTOMER_FRONTEND

Folder Structure

    .
    |---- src
    |     |---- actions
    |     |      |---- login.action.js
    |     |      |---- modal.action.js
    |     |      |---- order.action.js
    |     |---- components
    |     |      |---- Chat
    |     |      |      |---- index.js
    |     |      |      |---- Maximized.js
    |     |      |      |---- Message.js
    |     |      |      |---- MessageList.js
    |     |      |      |---- Minimized.js
    |     |      |      |---- RoomList.js
    |     |      |      |---- SendMessageForm.js
    |     |      |---- Checkout
    |     |      |      |---- index.js
    |     |      |---- Common
    |     |      |      |---- Bag
    |     |      |      |      |---- index.js
    |     |      |      |      |---- BagItem.js
    |     |      |      |---- Footer
    |     |      |      |      |---- index.js
    |     |      |      |---- Header
    |     |      |      |      |---- index.js
    |     |      |      |---- Modals
    |     |      |      |      |---- OrderModal
    |     |      |      |      |---- OrderUpdateModal
    |     |      |      |      |---- RatingModal
    |     |      |      |      |---- CookOnline.js
    |     |      |      |      |---- ErrorModal.js
    |     |      |      |      |---- FeedbackModal.js
    |     |      |      |      |---- FoodModal.js
    |     |      |      |      |---- index.js
    |     |      |      |      |---- MenuModal.js
    |     |      |      |      |---- PrivacyModal.js
    |     |      |      |      |---- ProfileModal.js
    |     |      |      |      |---- RequestModal.js
    |     |      |      |      |---- RequestUpdateModal.js
    |     |      |      |      |---- ShareappModal.js
    |     |      |      |      |---- ZipcodeModal.js
    |     |      |      |---- CustomeRating.js
    |     |      |---- FavoriteHomeCooks
    |     |      |      |---- favoriteHomecooks.js
    |     |      |      |---- index.js
    |     |      |---- FilterBar
    |     |      |      |---- index.js
    |     |      |---- Home
    |     |      |      |---- index.js
    |     |      |---- ListOfHomeCooks
    |     |      |      |---- Homecook.js
    |     |      |      |---- index.js
    |     |      |      |---- index.css
    |     |      |---- Login
    |     |      |      |---- index.js
    |     |      |---- Main
    |     |      |      |---- index.js
    |     |      |---- Orders
    |     |      |      |---- index.js
    |     |      |---- PrivacyPolicy
    |     |      |      |---- index.js
    |     |      |      |---- index.css
    |     |      |      |---- subBody01.js
    |     |      |      |---- subBody02.js
    |     |      |      |---- subBody03.js
    |     |      |      |---- subBody04.js
    |     |      |---- Profile
    |     |      |      |---- index.js
    |     |      |      |---- FavoriteFood.js
    |     |      |---- RecentOrders
    |     |      |      |---- index.js
    |     |      |---- Register
    |     |      |      |---- index.js
    |     |      |---- Requests
    |     |      |      |---- index.js
    |     |      |---- ResetPassword
    |     |      |      |---- index.js
    |     |      |---- ViewFoodOptions
    |     |      |      |---- index.js
    |     |---- config
    |     |      |---- index.js
    |     |---- constants
    |     |      |---- images
    |     |      |---- sounds
    |     |      |---- index.js
    |     |      |---- ModalKeys.js
    |     |---- reducers
    |     |      |---- index.js
    |     |      |---- login.reducer.js
    |     |      |---- modal.reducer.js
    |     |---- styles
    |     |      |---- Main.css
    |     |---- App.css
    |     |---- App.js
    |     |---- App.test.js
    |     |---- index.css
    |     |---- index.js
    |     |---- logo.svg
    |     |---- serviceWorker.js
    |---- .env.development
    |---- .env.production
    |---- .gitignore
    |---- package-lock.json
    |---- package.json
    |---- yarn.lock
    |---- README.md



Setting Up

    Install required modules
    npm install



Running the app in development

    npm start
