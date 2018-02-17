
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


    console.log(`WORKER: Fetch ${event.request.url}`);

    if(event.request.method !== 'GET') {
        return;
    }

    // If any request for a PNG image change the response for a different one
    /*
    if(event.request.url.endsWith('.png')) {
        event.respondWith(fetch('/css/img/different.png'));
    }
    */

    // Offline approach 1: assume everything is cached (BAD)
    /*
    event.respondWith(caches.match(event.request));
    */

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


    // Offline approach 3: Use the network if it's fast, otherwise use the cache
    /*
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                console.log(`WORKER: Updating cached data for ${event.request.url}...`);
                let responseClone = networkResponse.clone();
                caches.open('mycache').then((cache) => {
                    // responseClone ????
                    cache.put(event.request, networkResponse);
                });
                return networkResponse;
            })
            // If the network fails or is it too slow
            .timeout(200)
            .catch((_) => {
                console.log(`WORKER: Serving ${event.request.url} from CACHE`);
                return caches.match(event.request);
            })
    );
    */



});
