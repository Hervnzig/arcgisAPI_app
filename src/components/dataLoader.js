import { loadModules } from "esri-loader";

export const loadGeoJSONData = async (geojsonUrl, mapView, title, color) => {
  const [GeoJSONLayer] = await loadModules(["esri/layers/GeoJSONLayer"]);

  const geojsonLayer = new GeoJSONLayer({
    url: geojsonUrl,
    title: title,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: color,
        outline: {
          color: "white",
          width: 1,
        },
      },
    },
  });

  mapView.map.add(geojsonLayer);
};

export const loadCSVData = async (csvUrl, mapView, highlightColor) => {
  const [CSVLayer] = await loadModules(["esri/layers/CSVLayer"]);

  const csvLayer = new CSVLayer({
    url: csvUrl,
    title: "Transport Stations",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: highlightColor,
        size: "10px",
        outline: {
          color: "white",
          width: 0.4,
        },
      },
    },
  });

  mapView.map.add(csvLayer);
};
