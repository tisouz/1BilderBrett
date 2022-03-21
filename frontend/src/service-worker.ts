/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import {
  clientsClaim,
} from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, PrecacheFallbackPlugin } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkOnly,
} from "workbox-strategies";

declare const self: any;

const FALLBACK_URL = "/offline";
const CACHE_NAME = "offline-page";

/**
 * Precaching assets created by build process
 */
precacheAndRoute(self.__WB_MANIFEST);

/**
 *
 * INSTALL
 *
 * Instructs the latest service worker to activate after installation, as soon as it enters the waiting phase.
 * https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase
 *
 */
self.addEventListener("install", function (event: any) {
  // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#provide_a_fallback_response_to_a_route
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(FALLBACK_URL))
  );
});

/**
 *
 * ACTIVATE
 *
 * Instructs the latest service worker to take control of all clients as soon as it's activated.
 * https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#clientsclaim
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
 * https://developers.google.com/web/tools/workbox/guides/common-recipes#caching_images
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
 * https://developers.google.com/web/tools/workbox/guides/common-recipes#restrict_caches_for_a_specific_origin
 * StaleWhileRevalidate: Request resources from cache and network in parallel. Cache is updated with network response if it is available
 */

registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/") && !url.pathname.startsWith("/api"),
  new StaleWhileRevalidate({
    cacheName: "frontend",
    plugins: [new PrecacheFallbackPlugin({fallbackURL:FALLBACK_URL})],
  })
);

/**
 *
 * Routing backend pages
 * NetworkOnly: Fetch only if resource is online 
 * 
 */

registerRoute(
  ({ url }) => url.pathname.startsWith("/api"),
  new NetworkOnly({
    plugins: [new PrecacheFallbackPlugin({fallbackURL:FALLBACK_URL})],
  })
);