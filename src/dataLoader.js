import { loadModules } from "esri-loader";

export const loadGeoJSONData = async (geojsonUrl, mapView, title) => {
  const [GeoJSONLayer] = await loadModules(["esri/layers/GeoJSONLayer"]);

  const geojsonLayer = new GeoJSONLayer({
    url: geojsonUrl,
    title: title,
  });

  mapView.map.add(geojsonLayer);
};

export const loadCSVData = async (csvUrl, mapView) => {
  const [CSVLayer] = await loadModules(["esri/layers/CSVLayer"]);

  const csvLayer = new CSVLayer({
    url: csvUrl,
    title: "Transport Stations",
  });

  mapView.map.add(csvLayer);
};
