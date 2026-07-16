importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

// Config is injected at build time — kept in SW for background message handling
firebase.initializeApp({
  apiKey: 'AIzaSyB7vCcAx9XsZhqARcPicjZ5T950Iyt3Qs',
  authDomain: 'loshy-486d9.firebaseapp.com',
  projectId: 'loshy-486d9',
  storageBucket: 'loshy-486d9.firebasestorage.app',
  messagingSenderId: '768025075312',
  appId: '1:768025075312:web:e39b4798d3b10500031eb5',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Loshy';
  const body = payload.notification?.body || '';
  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload.data,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
