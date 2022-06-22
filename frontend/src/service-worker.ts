/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, PrecacheFallbackPlugin } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
    StaleWhileRevalidate,
    CacheFirst,
    NetworkOnly,
} from "workbox-strategies";

declare const self: any;
const FALLBACK_URL = "/";

/**
 * Precaching assets created by build process
 */
precacheAndRoute(self.__WB_MANIFEST);

/**
 *
 * INSTALL
 *
 * Instructs the service worker to wait in the installation phase until the defined URL was added to the cache.
 * https://web.dev/service-worker-lifecycle/#install
 *
 */
self.addEventListener("install", function (event: any) {
    // https://web.dev/service-worker-lifecycle/#skip-the-waiting-phase
    //Instructs service worker to skip the waiting phase and to activate itself as soon as it’s finished installing
    self.skipWaiting();
});

/**
 *
 * ACTIVATE
 *
 * Instructs the latest service worker to take control of all clients in his scope as soon as it's activated.
 * https://web.dev/service-worker-lifecycle/#clients.claim
 *
 */
self.addEventListener("activate", function (event: any) {
    event.waitUntil(clientsClaim());
});

/**
 *
 * FETCH
 *
 * Define routes for requests
 *
 */

/**
 * Cache images for a month (image are not going to change frequently)
 * CacheFirst: first look in cache, then ask over network.
 * https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/
 */

registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
        cacheName: "images",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

/**
 * Cache frontend pages
 * https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/
 * StaleWhileRevalidate: Request resources from cache and network in parallel. Cache is updated with network response if it is available
 */

registerRoute(
    ({ url }) =>
        url.hostname.includes("1bilderbrett.com") &&
        url.pathname.startsWith("/") &&
        !url.pathname.startsWith("/api"),
    new StaleWhileRevalidate({
        cacheName: "frontend",
        plugins: [new PrecacheFallbackPlugin({ fallbackURL: FALLBACK_URL })],
    })
);

/**
 *
 * Routing backend pages
 * NetworkOnly: Fetch only if resource is online
 *
 */

registerRoute(
    ({ url }) =>
        url.hostname.includes("1bilderbrett.com") &&
        url.pathname.startsWith("/api"),
    new NetworkOnly({
        plugins: [new PrecacheFallbackPlugin({ fallbackURL: FALLBACK_URL })],
    })
);
