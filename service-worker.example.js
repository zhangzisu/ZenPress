/* eslint-disable */
workbox.routing.registerRoute(
    new RegExp('https://your-server.com/api/your-api-key/'),
    workbox.strategies.networkFirst(),
);