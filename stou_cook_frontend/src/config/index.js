import Pusher from 'pusher-js';

export const serverURL = `http://localhost:5000`;
export const firebaseConfig = {
    apiKey: "AIzaSyCKRmXkIQqNtPTM-_MMvsQYMH1tSm7IlNM",
    authDomain: "stou-79b9a.firebaseapp.com",
    databaseURL: "https://stou-79b9a.firebaseio.com",
    projectId: "stou-79b9a",
    storageBucket: "stou-79b9a.appspot.com",
    messagingSenderId: "135234417719",
    appId: "1:135234417719:web:a6233dfcab2935a2e67bb2",
    measurementId: "G-EWZ35B7N17"
};
Pusher.logToConsole = true;
export const pusher = new Pusher('244fae1265174aa1b9eb', {
  cluster: 'us2',
  forceTLS: true
});