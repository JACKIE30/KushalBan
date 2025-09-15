module.exports = [
"[project]/frontend/node_modules/leaflet/dist/leaflet-src.js [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/frontend/node_modules/leaflet/dist/leaflet-src.js [app-ssr] (ecmascript)");
    });
});
}),
"[project]/frontend/node_modules/leaflet-draw/dist/leaflet.draw.js [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/9e883_leaflet-draw_dist_leaflet_draw_83c92b52.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/frontend/node_modules/leaflet-draw/dist/leaflet.draw.js [app-ssr] (ecmascript)");
    });
});
}),
];