(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/pages/fra-atlas-map.tsx [app-client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/node_modules_5e32c0e0._.js",
  "static/chunks/src_app_pages_fra-atlas-map_tsx_4960a700._.js",
  {
    "path": "static/chunks/node_modules_318a0542._.css",
    "included": [
      "[project]/node_modules/leaflet/dist/leaflet.css [app-client] (css)",
      "[project]/node_modules/leaflet-draw/dist/leaflet.draw.css [app-client] (css)"
    ],
    "moduleChunks": [
      "static/chunks/node_modules_leaflet_dist_leaflet_css_bad6b30c._.single.css",
      "static/chunks/node_modules_leaflet-draw_dist_leaflet_draw_css_bad6b30c._.single.css"
    ]
  },
  "static/chunks/src_app_pages_fra-atlas-map_tsx_3161014d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/app/pages/fra-atlas-map.tsx [app-client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);