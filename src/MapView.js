import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import { loadGeoJSONData, loadCSVData } from "./dataLoader";

const MapView = ({ setView, searchLocation }) => {
  const mapRef = useRef();
  const viewRef = useRef();

  useEffect(() => {
    loadModules(
      [
        "esri/views/MapView",
        "esri/WebMap",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Sketch",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/widgets/Legend",
      ],
      { css: true }
    ).then(
      ([
        MapView,
        WebMap,
        BasemapToggle,
        Sketch,
        GraphicsLayer,
        Graphic,
        Legend,
      ]) => {
        const webMap = new WebMap({
          basemap: "streets",
        });

        const view = new MapView({
          container: mapRef.current,
          map: webMap,
          center: [-7.0926, 31.7917], // Center on Morocco
          zoom: 6,
        });

        viewRef.current = view;

        const basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: "satellite",
        });

        view.ui.add(basemapToggle, "bottom-right");

        // Load GeoJSON and CSV data
        loadGeoJSONData("/data/provinces.geojson", view, "Provinces");
        loadGeoJSONData("/data/regions.geojson", view, "Regions");
        loadCSVData("/data/transport_stations.csv", view);

        // Create a GraphicsLayer for sketching
        const graphicsLayer = new GraphicsLayer();
        webMap.add(graphicsLayer);

        // Add the Sketch widget
        const sketch = new Sketch({
          layer: graphicsLayer,
          view: view,
          availableCreateTools: ["point", "polyline", "polygon"],
          creationMode: "update",
          defaultUpdateOptions: {
            tool: "none",
            enableRotation: true,
            enableScaling: true,
          },
        });

        view.ui.add(sketch, "top-right");

        // Create a delete button
        const deleteButton = document.createElement("button");
        deleteButton.className =
          "esri-widget esri-widget--button esri-interactive";
        deleteButton.title = "Delete Selected Geometry";
        deleteButton.innerHTML = '<span class="esri-icon-trash"></span>';
        deleteButton.onclick = () => {
          const selectedGraphics = sketch.layer.graphics.items.filter(
            (graphic) => graphic.selected
          );
          selectedGraphics.forEach((graphic) => {
            sketch.layer.remove(graphic);
          });
        };

        // Add the delete button to the view
        view.ui.add(deleteButton, "top-right");

        // Add the Legend widget
        const legend = new Legend({
          view: view,
        });

        view.ui.add(legend, "bottom-left");

        // Set view in parent component after it is fully initialized
        setView(view);
      }
    );
  }, [setView]);

  useEffect(() => {
    if (searchLocation && viewRef.current) {
      loadModules(["esri/Graphic"]).then(([Graphic]) => {
        const point = {
          type: "point",
          longitude: searchLocation.longitude,
          latitude: searchLocation.latitude,
        };

        const markerSymbol = {
          type: "simple-marker",
          color: [226, 119, 40], // Orange
          outline: {
            color: [255, 255, 255], // White
            width: 2,
          },
        };

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
        });

        viewRef.current.graphics.removeAll();
        viewRef.current.graphics.add(pointGraphic);
        viewRef.current.goTo({ target: point, zoom: 14 });
      });
    }
  }, [searchLocation]);

  return (
    <div className="map-view" ref={mapRef} style={{ height: "100vh" }}></div>
  );
};

export default MapView;
