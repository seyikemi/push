// importScripts("https://code.getmdl.io/1.3.0/material.min.js") 
firebase.initializeApp({
    apiKey: "AIzaSyC0OP-0kb4fHHOFfwGsdGbPnXYuRou4SkY",
    authDomain: "veritas-pensions.firebaseapp.com",
    databaseURL: "https://veritas-pensions.firebaseio.com",
    projectId: "veritas-pensions",
    storageBucket: "veritas-pensions.appspot.com",
    messagingSenderId: "416201517362"
  });
  const messaging = firebase.messaging(),

  database  = firebase.database(),
  pushBtn   = document.getElementById('push-button')

let userToken    = null,
isSubscribed = false

window.addEventListener('load', () => {

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('firebase-messaging-sw.js')
        .then(registration => {

            messaging.useServiceWorker(registration)
          console.log(registration)
            initializePush()
        })
        .catch(err => console.log('Service Worker Error', err))

} else {
    pushBtn.textContent = 'Push not supported.'
}

})

messaging.onMessage(payload => {
    console.log('onMessage:', payload);
     
    
    
    
    });
    



function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {

  if (Notification.permission === 'denied') {
      pushBtn.textContent = 'Subscription blocked'
      return
  }

  pushBtn.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe'
  pushBtn.disabled = false
}




function initializePush() {

   

  isSubscribed = userToken !== null
  updateBtn()

  pushBtn.addEventListener('click', () => {
      pushBtn.disabled = true

      if (isSubscribed) return unsubscribeUser()

      return subscribeUser()
  })
}


function subscribeUser() {

    messaging.requestPermission()
    .then(function(){
      console.log("have permission");
      return messaging.getToken();
    })
     .then(function(token){
  console.log(token);

        writeUserData(token)
          updateSubscriptionOnServer(token)
          isSubscribed = true
          userToken = token
          localStorage.setItem('pushToken', token)
          updateBtn()
       
   
      })
      .catch(err => console.log('Denied', err))

}

function writeUserData(token) {
    console.log(token);
    console.log("getting here");
    firebase.database().ref('Token=' + token).set({
      token: token,
     
    });
    console.log("message sent");
  }

function updateSubscriptionOnServer(token) {

   
    // link to your database here
//   $.post("https://veritas-pensions.firebaseio.com",   {
//         token : token
        
//     },
//     function(data, status){
//         console.log("Data: " + token + "\nStatus: " + status);
//     });
   

  if (isSubscribed) {
      return database.ref('device_ids')
              .equalTo(token)
              .on('child_added', snapshot => snapshot.ref.remove())
  }

  database.ref('device_ids').once('value')
      .then(snapshots => {
          let deviceExists = false

          snapshots.forEach(childSnapshot => {
              if (childSnapshot.val() === token) {
                  deviceExists = true
                  return console.log('Device already registered.');
              }

          })

          if (!deviceExists) {
              console.log('Device subscribed');
              return database.ref('device_ids').push(token)
          }
      })
}


function unsubscribeUser(userToken) {

  messaging.deleteToken(userToken)
      .then(() => {
          updateSubscriptionOnServer(userToken)
          isSubscribed = false
          userToken = null
          localStorage.removeItem('pushToken')
          updateBtn()
      })
      .catch(err => console.log('Error unsubscribing', err))
}



messaging.onTokenRefresh(function() {
    messaging.getToken().then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // ...
    }).catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });
  


