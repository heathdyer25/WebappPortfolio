const STATIC_CACHE_NAME = 'shounen-showdown-static-v1';

function log(...data) {
    console.log("SWv1.0", ...data);
}

// URLS of resources to Install 
const installURLs = [
    '/',
    '/offline',
    '/index.html',
    '/static/js/bundle.js',
    //images for cards
    '/images/cards/1.jpg',
    '/images/cards/2.jpg',
    '/images/cards/3.jpg',
    '/images/cards/4.jpg',
    '/images/cards/5.jpg',
    '/images/cards/6.jpg',
    '/images/cards/7.jpg',
    '/images/cards/8.jpg',
    '/images/cards/10.jpg',
    '/images/cards/11.jpg',
    '/images/cards/12.jpg',
    '/images/cards/13.jpg',
    '/images/cards/14.jpg',
    '/images/cards/15.jpg',
    '/images/cards/16.jpg',
    '/images/cards/17.jpg',
    '/images/cards/18.jpg',
    '/images/cards/19.jpg',
    '/images/cards/20.jpg',
    '/images/cards/21.jpg',
    '/images/cards/22.jpg',
    '/images/cards/23.jpg',
    '/images/cards/24.jpg',
    '/images/cards/25.jpg',
    '/images/cards/26.jpg',
    '/images/cards/27.jpg',
    '/images/cards/28.jpg',
    '/images/cards/29.jpg',
    '/images/cards/30.jpg',
    '/images/cards/31.jpg',
    '/images/cards/32.jpg',
    //images for icons
    '/images/icons/battle.png',
    '/images/icons/Brawler.png',
    '/images/icons/cards.png',
    '/images/icons/coin.svg',
    '/images/icons/Energy.png',
    '/images/icons/Mobility.png',
    '/images/icons/Mystic.png',
    '/images/icons/settings.png',
    '/images/icons/shop.png',
    '/images/icons/trophy.png',
    '/images/profile/default.jpg',
    // icons
    '/images/icon-192x192.png',
    '/images/icon-256x256.png',
    '/images/icon-384x384.png',
    '/images/icon-512x512.png',
];


// Install resources and cache
self.addEventListener('install', event => {
    log('install', event);
  
    // As soon as this method returns, the service worker is considered installed
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            return cache.addAll(installURLs);
        })
    );
});

// When service  worker activates
self.addEventListener('activate', event => {
  log('activate', event);

  // As soon as this method returns, the service worker is considered active
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => cacheName.startsWith('shounen-showdown-') && cacheName != STATIC_CACHE_NAME)
    })
    //delete old caches
    .then(oldCaches => {
      return Promise.all(
        oldCaches.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);
  //Treat API calls (to our own API) differently
  if(requestURL.origin === location.origin && requestURL.pathname.startsWith('/api')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        networkFirst(event.request)
      );
    }

    if (event.request.method === 'PUT') {
        const requestURL = new URL(event.request.url);
        const clonedRequest = event.request.clone();
        
        event.respondWith(
            fetch(event.request).catch(() => {
                // If we're offline and it's the right URL pattern
                const deckMatch = requestURL.pathname.match(/^\/api\/users\/([^/]+)\/decks$/);
          
                if (deckMatch) {
                    const userId = deckMatch[1];
                    return clonedRequest.json().then((body) => {
                        return saveDeck(userId, body.cards)
                            .then(() => new Response(JSON.stringify({ message: "Saved deck offline" }), {
                                status: 200,
                                headers: { "Content-Type": "application/json" }
                            }))
                            .catch(() => new Response(JSON.stringify({ error: "Failed to save deck offline" }), {
                                status: 500,
                                headers: { "Content-Type": "application/json" }
                            }))
                    });
                }

                const battleResultsMatch = requestURL.pathname.match(/^\/api\/users\/([^/]+)\/battle-results$/);
                if (battleResultsMatch) {
                    const userId = battleResultsMatch[1];
                    return clonedRequest.json().then((body) => {
                        body.userId = userId;
                        console.log("saving battle results");
                        return saveBattleResults(body)  // Assuming saveBattleResults takes `body` as the argument
                            .then(() => new Response(JSON.stringify({ message: "Saved battle results offline" }), {
                                status: 200,
                                headers: { "Content-Type": "application/json" }
                            }))
                            .catch(() => new Response(JSON.stringify({ error: "Failed to save battle results offline" }), {
                                status: 500,
                                headers: { "Content-Type": "application/json" }
                            }));
                    });
                }

                return Promise.resolve(new Response("Invalid offline PUT request", { status: 400 }));
            })
        );
        return;
    }

    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .catch(() => caches.match('/offline'))
      );
      return;
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      cacheFirst(event.request)
    );
  }
});

/**
 * Sync events to load when back online
 */
self.addEventListener('sync', event => {
    if (event.tag === 'sync-offline') {
        //make requests for syncing deck
        getDeck().then(deck => {
            console.log("deck: ", deck);
            if (!deck) return;
            fetch(`/api/users/${deck.userId}/decks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cards: deck.cards
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Deck update response:', data);
            })
            .catch(error => {
                console.error('Error updating deck:', error);
            });
        })
        .catch(error => {
            console.log(error);
        })

        //make requests for battle results
        getBattleResults().then(battles => {
            if (!battles) return;
            console.log("testing sync battles");
            battles.forEach(battle => {
                fetch(`/api/users/${battles.userId}/battle-results`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(battle)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Deck update response:', data);
                })
                .catch(error => {
                    console.error('Error updating deck:', error);
                });
            })
        })
        .catch(error => {
            console.log(error);
        })
    }
});


function fetchAndCache(request) {
  return fetch(request).then(response => {
    const requestUrl = new URL(request.url);
    //Cache successful GET requests that are not browser extensions
    if(response.ok && request.method === "GET") {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  });
}


function cacheFirst(request) {
  return caches.match(request)
  .then(response => {
    //Return a response if we have one cached. Otherwise, get from the network
    return response || fetchAndCache(request);
  })
  .catch(error => {
    // This will only be called if there is an error fetching from the network
    return caches.match('/offline');
  });
}

function networkFirst(request) {
  return fetchAndCache(request)
  .catch(error => {
    //If we get an error, try to return from cache
    return caches.match(request);
  })
  .then(response => {
    return response || caches.match('/offline');
  });
}

self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});



/****************************************************************************************
 *  INDEXED DB METHODSs
*********************************************************************************************/
 

/**
 * @author Heath Dyer
 * Functions for IndexedDB, managing offline data to persist
 * to make put/ post requests when back online
 */

const DB_NAME = "shounenshowdown";
const DECKS_STORE_NAME = "decks";
const BATTLES_STORE_NAME = "battles";
const DB_VERSION = 1;

// open or create the indexed DB
const openDB = () => {
    return new Promise((resolve, reject) => {
        // request database
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        //database not open
        request.onerror = (event) => {
            reject("Could not open offline database");
        };

        //upgrade if new version, or create if first version 
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            //create deck store if doesnt exist
            if (!db.objectStoreNames.contains(DECKS_STORE_NAME)) {
                db.createObjectStore(DECKS_STORE_NAME, { keyPath: "userId" });
            }
            //create battles store if it doesnt exist
            if (!db.objectStoreNames.contains(BATTLES_STORE_NAME)) {
                db.createObjectStore(BATTLES_STORE_NAME);
            }
        };

        //database open
        request.onsuccess = () => {
            resolve(request.result);
        };
    });
}

/**
 * 
 * @param {*} userId 
 * @param {*} cards 
 * @returns 
 */
const saveDeck = (userId, cards) => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction([DECKS_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(DECKS_STORE_NAME);
            const request = store.put({ 
                "userId": userId,
                "cards": cards,
            });
    
            request.onsuccess = () => {
                resolve("Successfully saved deck offline.");
            };
            
            request.onerror = () => {
                reject("Could not store deck in offline db");
            };
        })
        .catch(error => {
            reject(error);
        });
    })
};

/**
 * 
 * @param {*} userId 
 * @returns 
 */
const getDeck = () => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction([DECKS_STORE_NAME], 'readonly');
            const store = transaction.objectStore(DECKS_STORE_NAME);
            const request = store.getAll();
            
            request.onsuccess = () => {
                const decks = request.result;
                if (decks && decks.length > 0) {
                    resolve({
                        userId: decks[0].userId,
                        cards: decks[0].cards
                    });
                } else {
                    resolve(null); // No decks found
                }
            };
            
            request.onerror = () => {
                return reject("Could not get deck from offline DB");
            };
    
        })
        .catch(error => {
            return reject(error);
        });
    })
}

/**
 * 
 * @param {*} userId 
 * @returns 
 */
const clearDeck = (userId) => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction([DECKS_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(DECKS_STORE_NAME);
            const request = store.delete(userId);

            request.onsuccess = () => {
                resolve();
            }
            request.onerror = () => {
                reject("Could not clear deck from offline DB");
            }
        })
        .catch(error => {
            console.log("Failed to clear deck: ", error);
            reject(error);
        });
    });
}

const saveBattleResults = (data) => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction([BATTLES_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(BATTLES_STORE_NAME);
            const request = store.put(data);

            request.onsuccess = () => {
                resolve();
            }
            request.onerror = () => {
                reject("Could not save battle restuls for offline DB");
            }
        })
        .catch(error => {
            console.log("Failed to clear deck: ", error);
            reject(error);
        });
    });
}

const getBattleResults = () => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction([BATTLES_STORE_NAME], 'readonly');
            const store = transaction.objectStore(BATTLES_STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                if (!request.result) {
                    return null;
                }
                resolve(request.result);
            }
            request.onerror = () => {
                reject("Could not retrieve saved battle results for offline DB");
            }
        })
        .catch(error => {
            console.log("Failed to load battle results: ", error);
            reject(error);
        });
    });
}

const clearBattleResults = () => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction([BATTLES_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(BATTLES_STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                resolve("Cleared all battle results from offline DB");
            };
            request.onerror = () => {
                reject("Failed to clear battle results from offline DB");
            };
        })
        .catch(error => {
            console.log("Error opening DB while clearing battle results: ", error);
            reject(error);
        });
    });
}