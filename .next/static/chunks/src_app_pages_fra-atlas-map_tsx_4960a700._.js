(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/pages/fra-atlas-map.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FRAAtlasMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2d$draw$2f$dist$2f$leaflet$2e$draw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet-draw/dist/leaflet.draw.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$shpjs$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/shpjs/lib/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function FRAAtlasMap(param) {
    let { showDistricts, showVillages } = param;
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const districtLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const villageLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FRAAtlasMap.useEffect": ()=>{
            if (mapRef.current) return; // prevent multiple inits
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map("map", {
                center: [
                    23.5,
                    78.5
                ],
                zoom: 6
            });
            mapRef.current = map;
            // Base layers
            const osm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap"
            }).addTo(map);
            const esriSat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                attribution: "© Esri, Maxar"
            });
            const esriLabels = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
                attribution: "© Esri"
            });
            const satelliteHybrid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].layerGroup([
                esriSat,
                esriLabels
            ]);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].control.layers({
                OpenStreetMap: osm,
                "Satellite Hybrid": satelliteHybrid
            }, {}).addTo(map);
            // Load district & village GeoJSON
            fetch("/assets/india_dist_demo.geojson").then({
                "FRAAtlasMap.useEffect": (res)=>res.json()
            }["FRAAtlasMap.useEffect"]).then({
                "FRAAtlasMap.useEffect": (data)=>{
                    districtLayerRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].geoJSON(data, {
                        style: {
                            color: "#15803d",
                            weight: 2,
                            fillOpacity: 0
                        }
                    });
                }
            }["FRAAtlasMap.useEffect"]);
            fetch("/assets/india_village_demo.geojson").then({
                "FRAAtlasMap.useEffect": (res)=>res.json()
            }["FRAAtlasMap.useEffect"]).then({
                "FRAAtlasMap.useEffect": (data)=>{
                    villageLayerRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].geoJSON(data, {
                        style: {
                            color: "#65a30d",
                            weight: 1,
                            fillOpacity: 0
                        }
                    });
                }
            }["FRAAtlasMap.useEffect"]);
            // Coordinates box (green styling)
            const CoordsControl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Control.extend({
                onAdd: {
                    "FRAAtlasMap.useEffect.CoordsControl": function() {
                        const div = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].DomUtil.create("div", "leaflet-bar px-3 py-1 rounded shadow text-sm bg-green-600 text-white font-medium");
                        div.id = "coords";
                        div.innerHTML = "Lat: -- , Lng: --";
                        return div;
                    }
                }["FRAAtlasMap.useEffect.CoordsControl"]
            });
            new CoordsControl({
                position: "bottomleft"
            }).addTo(map);
            map.on("mousemove", {
                "FRAAtlasMap.useEffect": (e)=>{
                    const el = document.getElementById("coords");
                    if (el) el.innerHTML = "Lat: ".concat(e.latlng.lat.toFixed(5), " , Lng: ").concat(e.latlng.lng.toFixed(5));
                }
            }["FRAAtlasMap.useEffect"]);
            // Shapefile upload
            const fileInput = document.getElementById("shapefileUpload");
            if (fileInput) {
                fileInput.addEventListener("change", {
                    "FRAAtlasMap.useEffect": (e)=>{
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ({
                            "FRAAtlasMap.useEffect": ()=>{
                                if (!reader.result) return;
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$shpjs$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(reader.result).then({
                                    "FRAAtlasMap.useEffect": (geojson)=>{
                                        const fraPattaLayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].geoJSON(geojson, {
                                            style: {
                                                color: "#047857",
                                                weight: 3,
                                                fillOpacity: 0
                                            },
                                            onEachFeature: {
                                                "FRAAtlasMap.useEffect.fraPattaLayer": (feature, layer)=>{
                                                    if (feature.properties) {
                                                        layer.bindPopup(JSON.stringify(feature.properties));
                                                    }
                                                }
                                            }["FRAAtlasMap.useEffect.fraPattaLayer"]
                                        }).addTo(map);
                                        map.fitBounds(fraPattaLayer.getBounds());
                                    }
                                }["FRAAtlasMap.useEffect"]);
                            }
                        })["FRAAtlasMap.useEffect"];
                        reader.readAsArrayBuffer(file);
                    }
                }["FRAAtlasMap.useEffect"]);
            }
            // Draw tools
            const drawnItems = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].FeatureGroup();
            map.addLayer(drawnItems);
            const drawControl = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Control.Draw({
                edit: {
                    featureGroup: drawnItems,
                    remove: true
                },
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        shapeOptions: {
                            color: "#22c55e"
                        }
                    },
                    rectangle: {
                        shapeOptions: {
                            color: "#16a34a"
                        }
                    },
                    polyline: false,
                    circle: false,
                    marker: false
                }
            });
            map.addControl(drawControl);
            map.on(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Draw.Event.CREATED, {
                "FRAAtlasMap.useEffect": (e)=>{
                    const layer = e.layer;
                    drawnItems.addLayer(layer);
                    layer.bindPopup("Custom FRA Claim").openPopup();
                }
            }["FRAAtlasMap.useEffect"]);
            // Export to GeoJSON
            window.exportToGeoJSON = ({
                "FRAAtlasMap.useEffect": ()=>{
                    const data = drawnItems.toGeoJSON();
                    const blob = new Blob([
                        JSON.stringify(data)
                    ], {
                        type: "application/json"
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "fra_claims.geojson";
                    a.click();
                }
            })["FRAAtlasMap.useEffect"];
            return ({
                "FRAAtlasMap.useEffect": ()=>{
                    map.remove();
                }
            })["FRAAtlasMap.useEffect"];
        }
    }["FRAAtlasMap.useEffect"], []);
    // Toggle districts/villages dynamically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FRAAtlasMap.useEffect": ()=>{
            const map = mapRef.current;
            if (!map) return;
            if (showDistricts && districtLayerRef.current) {
                districtLayerRef.current.addTo(map);
            } else {
                var _districtLayerRef_current;
                (_districtLayerRef_current = districtLayerRef.current) === null || _districtLayerRef_current === void 0 ? void 0 : _districtLayerRef_current.remove();
            }
            if (showVillages && villageLayerRef.current) {
                villageLayerRef.current.addTo(map);
            } else {
                var _villageLayerRef_current;
                (_villageLayerRef_current = villageLayerRef.current) === null || _villageLayerRef_current === void 0 ? void 0 : _villageLayerRef_current.remove();
            }
        }
    }["FRAAtlasMap.useEffect"], [
        showDistricts,
        showVillages
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "map",
        className: "h-full w-full rounded-lg shadow-inner"
    }, void 0, false, {
        fileName: "[project]/src/app/pages/fra-atlas-map.tsx",
        lineNumber: 173,
        columnNumber: 10
    }, this);
}
_s(FRAAtlasMap, "HIQ3MHGKSNQpjYy2PBJECyENz0U=");
_c = FRAAtlasMap;
var _c;
__turbopack_context__.k.register(_c, "FRAAtlasMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/pages/fra-atlas-map.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/pages/fra-atlas-map.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_app_pages_fra-atlas-map_tsx_4960a700._.js.map