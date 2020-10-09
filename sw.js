self.addEventListener("install", (event) => {
  console.log(self);
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["index.html", "js/index.js", "offline.html"]);
    })
  );
  self.skipWaiting();
  console.log("SW installed at: ", new Date().toLocaleDateString());
});

self.addEventListener("activate", (event) => {
  self.skipWaiting();
  console.log("SW activated at: ", new Date().toLocaleDateString());
});

self.addEventListener("fetch", (event) => {
  //console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!navigator.onLine) {
        if (response) {
          return response;
        } else {
          return caches.match(new Request("offline.html"));
        }
      } else if (event.request.method === "GET") {
        return updateCache(event.request);
      } else {
        return fetch(event.request);
      }
    })
  );
  /*if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        console.log("RESPONSE: ", response);
        if (response) {
          return response;
        } else if (response) {
          return caches.match(new Request("offline.html"));
        }
      })
    );
  } else {
    console.log("Online!");
    return updateCache(event.request);
  }*/
});

async function updateCache(request) {
  console.log(request);
  return fetch(request).then((response) => {
    if (response) {
      return caches.open("v1").then((cache) => {
        return cache.put(request, response.clone()).then(() => {
          return response;
        });
      });
    }
  });
}

//Lyssnar efter push notiser
self.addEventListener("push", (event) => {
  if (event.data) {
    createNotification(event.data.text());
  }
});

//Skapar en notifikation med Web notifications API
const createNotification = (text) => {
  self.registration.showNotification("Traffic Information: ", {
    body: text,
    icon: "images/icon-apple-touch.png",
  });
};
