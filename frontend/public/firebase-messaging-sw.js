// Firebase Messaging Service Worker
// This file is required for Firebase messaging to work in the browser

self.addEventListener('install', (event) => {
  console.log('Firebase messaging service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Firebase messaging service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle background messages
self.addEventListener('message', (event) => {
  console.log('Firebase messaging service worker received message:', event.data);
});