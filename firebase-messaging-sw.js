importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-database.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js')

firebase.initializeApp({
  apiKey: "AIzaSyC0OP-0kb4fHHOFfwGsdGbPnXYuRou4SkY",
  authDomain: "veritas-pensions.firebaseapp.com",
  databaseURL: "https://veritas-pensions.firebaseio.com",
  projectId: "veritas-pensions",
  storageBucket: "veritas-pensions.appspot.com",
  messagingSenderId: "416201517362"
});
firebase.initializeApp();
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
  const title = "hello";
  const options = {
    body:payload.data.status
  };
  return self.registration.showNotification(title, options);
});

