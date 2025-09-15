(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/node_modules_ffd23f7d._.js",
  "static/chunks/components_LeafletMap_tsx_f3c6bb3e._.js",
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
  "static/chunks/components_LeafletMap_tsx_6bd999ba._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/components/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);