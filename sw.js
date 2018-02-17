
/* Service Worker
================================================================== */



/* Install Event
========================== */

self.addEventListener('install', (event) => {

    console.log('WORKER: Installing.................');

    const urlsToCache = [
        '/',
        '/css/main.css',
        '/js/main.js',
        '/vendor/css/bootstrap.min.css',
        '/vendor/js/bootstrap.min.js',
        '/vendor/js/popper.min.js',
        '/vendor/js/jquery.min.js'
    ];

    caches.delete('mycache');
    event.waitUntil(
        caches.open('mycache')
            .then((cache) => cache.addAll(urlsToCache))
            .then((_) => self.skipWaiting())
    );

    // Otherwise it only updates when the user leaves the site
    //event.waitUntil(self.skipWaiting());

});



/* Fetch Event
========================== */

self.addEventListener('fetch', (event) => {

    console.log(`SW FETCH EVENT: ${event.request.url}`);

    if(event.request.method !== 'GET') {
        return;
    }

    /*
    // if any request for a PNG image change the response for this one
    if(event.request.url.endsWith('.png')) {
        event.respondWith(fetch('/css/img/face.png'));
    }
    */

    // Offline approach 1: assume everything is cached (BAD)
    //event.respondWith(caches.match(event.request));

    // Offline approach 2: try to make a request to the network and if it fails serve from the cache
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                console.log(`WORKER: Serving ${event.request.url} from NETWORK`);
                return networkResponse;
            }, () => {
                console.log(`WORKER: Serving ${event.request.url} from CACHE`);
                return caches.match(event.request);
            })
    );


});
