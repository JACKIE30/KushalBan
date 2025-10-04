"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import shp from "shpjs";
import L from "leaflet";
import "leaflet-draw";
import leafletImage from "leaflet-image";

export default function FRAAtlasPage() {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const districtLayerRef = useRef<L.GeoJSON<any> | null>(null);
  const villageLayerRef = useRef<L.GeoJSON<any> | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (mapRef.current) return; // prevent reinit on HMR

    // --- Init Map ---
    const map = L.map("map").setView([23.5, 78.5], 6);
    mapRef.current = map;

    // --- Base layers ---
    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const esriSat = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "© Esri, Maxar, Earthstar Geographics" }
    );
    const esriLabels = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { attribution: "© Esri" }
    );
    const satelliteHybrid = L.layerGroup([esriSat, esriLabels]);

    const baseMaps = {
      OpenStreetMap: osm,
      "Satellite Hybrid": satelliteHybrid,
    };
    L.control.layers(baseMaps).addTo(map);

    // --- Load Districts ---
    fetch("/assets/india_dist_demo.geojson")
      .then((res) => res.json())
      .then((data) => {
        districtLayerRef.current = L.geoJSON(data, {
          style: { color: "blue", weight: 2, fillOpacity: 0 },
        });
      });

    // --- Load Villages ---
    fetch("/assets/india_village_demo.geojson")
      .then((res) => res.json())
      .then((data) => {
        villageLayerRef.current = L.geoJSON(data, {
          style: { color: "red", weight: 1, fillOpacity: 0 },
        });
      });

    // --- Mouse coords display ---
    const coordsDiv = document.getElementById("coords");
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      if (coordsDiv) {
        coordsDiv.innerHTML = `Lat: ${e.latlng.lat.toFixed(5)} , Lng: ${e.latlng.lng.toFixed(5)}`;
      }
    });

    // --- Shapefile upload ---
    const fileInput = document.getElementById("shapefileUpload") as HTMLInputElement;
    fileInput?.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function () {
        shp(reader.result as ArrayBuffer).then((geojson) => {
          const fraPattaLayer = L.geoJSON(geojson as any, {
            style: { color: "purple", weight: 3, fillOpacity: 0 },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(JSON.stringify(feature.properties));
              }
            },
          }).addTo(map);
          map.fitBounds(fraPattaLayer.getBounds());
        });
      };
      reader.readAsArrayBuffer(file);
    });

    // --- Leaflet.draw ---
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems, remove: true },
      draw: {
        polygon: { allowIntersection: false, showArea: true, shapeOptions: { color: "green" } },
        rectangle: { shapeOptions: { color: "orange" } },
        polyline: false,
        circle: false,
        marker: false,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      layer.bindPopup("Custom FRA Claim").openPopup();
      console.log("New shape:", JSON.stringify(layer.toGeoJSON()));
    });

    map.on(L.Draw.Event.EDITED, (e: any) => {
      e.layers.eachLayer((layer: any) => {
        console.log("Edited shape:", JSON.stringify(layer.toGeoJSON()));
      });
    });

    map.on(L.Draw.Event.DELETED, (e: any) => {
      console.log("Deleted shapes:", e.layers.getLayers().length);
    });

    // --- Export GeoJSON ---
    (window as any).exportToGeoJSON = async () => {
      const data = drawnItems.toGeoJSON();
      const geoJsonString = JSON.stringify(data);
      
      try {
        const response = await fetch('/api/fra-atlas/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: geoJsonString,
            filename: 'fra_claims.geojson',
            type: 'geojson'
          })
        });
        
        const result = await response.json();
        console.log('Export response:', result);
        
        if (result.success) {
          console.log(`GeoJSON saved successfully to backend! File: ${result.filename}, Path: ${result.filepath}`);
        } else {
          console.error(`Failed to save GeoJSON: ${result.error || result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Export error:', error);
        console.error(`Failed to export GeoJSON to backend: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    // --- Export Polygon Image ---
    (window as any).exportPolygonImage = async () => {
      if (!mapRef.current) {
        console.error("Map not initialized!");
        return;
      }
      if (drawnItemsRef.current.getLayers().length === 0) {
        console.error("No drawn polygon found!");
        return;
      }

      const map = mapRef.current;
      const polygon = drawnItemsRef.current.getLayers()[0] as L.Polygon;

      leafletImage(map, async (err: any, canvas: HTMLCanvasElement) => {
        if (err) {
          console.error(err);
          console.error("Failed to capture map image");
          return;
        }

        const bounds = polygon.getBounds();
        const nw = map.latLngToContainerPoint(bounds.getNorthWest());
        const se = map.latLngToContainerPoint(bounds.getSouthEast());

        const width = se.x - nw.x;
        const height = se.y - nw.y;

        const clippedCanvas = document.createElement("canvas");
        clippedCanvas.width = width;
        clippedCanvas.height = height;
        const ctx = clippedCanvas.getContext("2d")!;

        // Build clipping path
        ctx.beginPath();
        (polygon.getLatLngs()[0] as L.LatLng[]).forEach((latlng, i) => {
          const point = map.latLngToContainerPoint(latlng);
          const x = point.x - nw.x;
          const y = point.y - nw.y;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.clip();

        // Draw clipped map
        ctx.drawImage(canvas, -nw.x, -nw.y);

        // Get base64 image data
        const imageData = clippedCanvas.toDataURL("image/png");
        
        try {
          const response = await fetch('/api/fra-atlas/export', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: imageData,
              filename: 'fra_polygon.png',
              type: 'image'
            })
          });
          
          const result = await response.json();
          console.log('Export response:', result);
          
          if (result.success) {
            console.log(`Image saved successfully to backend! File: ${result.filename}, Path: ${result.filepath}`);
          } else {
            console.error(`Failed to save image: ${result.error || result.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Export error:', error);
          console.error(`Failed to export image to backend: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full" />

      {/* Hamburger Button (only when menu closed) */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-20 right-4 z-[2000] bg-white p-2 rounded shadow hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-[1500] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Asset Mapping</h2>
          <button onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>

        <div className="p-4">
          <img
            src="/assets/sample_asset_map.jpeg"
            alt="Asset Map"
            className="rounded shadow mb-4"
          />
          <img
            src="/assets/sample_pie_chart.jpeg"
            alt="Pie Chart"
            className="rounded shadow mb-4"
          />
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Background:</span> 22.23%</p>
            <p><span className="font-semibold">Bareland:</span> 0.00%</p>
            <p><span className="font-semibold">Rangeland:</span> 15.23%</p>
            <p><span className="font-semibold">Developed Space:</span> 0.34%</p>
            <p><span className="font-semibold">Road:</span> 0.00%</p>
            <p><span className="font-semibold">Tree:</span> 26.30%</p>
            <p><span className="font-semibold">Water:</span> 0.23%</p>
            <p><span className="font-semibold">Agriculture land:</span> 35.67%</p>
            <p><span className="font-semibold">Building:</span> 0.00%</p>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white p-2 rounded shadow z-[1000] space-x-4">
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked && districtLayerRef.current && mapRef.current) {
                mapRef.current.addLayer(districtLayerRef.current);
                mapRef.current.fitBounds(districtLayerRef.current.getBounds());
              } else if (districtLayerRef.current && mapRef.current) {
                mapRef.current.removeLayer(districtLayerRef.current);
              }
            }}
          />{" "}
          Show Districts
        </label>
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked && villageLayerRef.current && mapRef.current) {
                mapRef.current.addLayer(villageLayerRef.current);
                mapRef.current.fitBounds(villageLayerRef.current.getBounds());
              } else if (villageLayerRef.current && mapRef.current) {
                mapRef.current.removeLayer(villageLayerRef.current);
              }
            }}
          />{" "}
          Show Villages
        </label>
      </div>

      {/* Upload Shapefile */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white p-2 rounded shadow z-[1000] text-center">
        <input type="file" id="shapefileUpload" accept=".zip" />
        <p className="text-sm">Upload FRA Shapefile (.zip)</p>
      </div>

      {/* Export Buttons */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 bg-white p-2 rounded shadow z-[1000] flex space-x-2">
        <button
          onClick={() => (window as any).exportToGeoJSON()}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Drawn Claims (GeoJSON)
        </button>
        <button
          onClick={() => (window as any).exportPolygonImage()}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export Polygon Image
        </button>
      </div>

      {/* Coordinates */}
      <div
        id="coords"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded shadow text-sm z-[1000]"
      >
        Lat: -- , Lng: --
      </div>
    </div>
  );
}
