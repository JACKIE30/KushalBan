(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/9e883_leaflet_dist_leaflet-src_b8cc0c06.js",
  "static/chunks/9e883_leaflet_dist_leaflet-src_eaa16b07.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/frontend/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
    });
});
}),
"[project]/frontend/node_modules/leaflet-draw/dist/leaflet.draw.js [app-client] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/9e883_leaflet-draw_dist_leaflet_draw_10eeaff0.js",
  "static/chunks/9e883_leaflet-draw_dist_leaflet_draw_eaa16b07.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/frontend/node_modules/leaflet-draw/dist/leaflet.draw.js [app-client] (ecmascript)");
    });
});
}),
]);