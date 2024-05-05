importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCtt4eH41MWcN4w9-9O0hpQahqsG8I-nBk",
    authDomain: "emailwish-cbc8a.firebaseapp.com",
    projectId: "emailwish-cbc8a",
    storageBucket: "emailwish-cbc8a.appspot.com",
    messagingSenderId: "264045761555",
    appId: "1:264045761555:web:d821e3b3b0aac7a29d5be6",
    measurementId: "G-H4HF4LC721"
});

const messaging = firebase.messaging(); 