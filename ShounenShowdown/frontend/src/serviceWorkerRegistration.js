const registerServiceWorker = () => {
    // Are service workers supported?
    if (!navigator.serviceWorker) {
        return;
    }

    //Register service worker
    navigator.serviceWorker.register('/serviceWorker.js')
    .then(registration => {
        //Our page is not yet controlled by anything. It's our first SW
        if (!navigator.serviceWorker.controller) {
            return;
        }
        // If instaling
        if (registration.installing) {
            console.log('Service worker installing');
        }
        else if (registration.waiting) {
            console.log('Service worker installed, but waiting');
            //newServiceWorkerReady(registration.waiting);
        }
        else if (registration.active) {
            console.log('Service worker active');
        }
        
        //This is fired whenever registration.installing gets a new worker
        registration.addEventListener('updatefound', () => {
            console.log("SW update found", registration, navigator.serviceWorker.controller);
            // newServiceWorkerReady(registration.installing);
        });
    })
    .catch(error => {
        console.error(`Registration failed with error: ${error}`);
    });

    // Message is printed everytime a service worker gets a message
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('SW message', event.data);
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload" in dev tools.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });

    window.addEventListener('online', () => {
        navigator.serviceWorker.ready.then(registration => {
            registration.sync.register("sync-offline");
        });
    });
}

export default registerServiceWorker;