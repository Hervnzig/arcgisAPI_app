import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import { loadGeoJSONData, loadCSVData } from "./dataLoader";

const MapView = ({
  setView,
  searchLocation,
  filter,
  basemap,
  setChartData,
}) => {
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
        "esri/geometry/SpatialReference",
        "esri/geometry/projection",
        "esri/layers/FeatureLayer",
        "esri/geometry/geometryEngine",
        "esri/rest/support/Query",
        "esri/widgets/LayerList",
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
        SpatialReference,
        projection,
        FeatureLayer,
        geometryEngine,
        Query,
        LayerList,
      ]) => {
        const webMap = new WebMap({
          basemap: basemap || "streets",
        });

        const view = new MapView({
          container: mapRef.current,
          map: webMap,
          center: [-7.0926, 31.7917], // Center on Morocco
          zoom: 6,
          highlightOptions: {
            color: [0, 120, 0, 0.5], // Dark green color with 50% opacity
            haloColor: "white",
            haloOpacity: 1,
          },
        });

        viewRef.current = view;

        const basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: "satellite",
        });

        view.ui.add(basemapToggle, "bottom-right");

        // Load GeoJSON and CSV data in the correct order with colors
        loadGeoJSONData(
          "/data/regions.geojson",
          view,
          "Regions",
          "rgba(193, 0, 0, 0.4)"
        ).then(() => {
          loadGeoJSONData(
            "/data/provinces.geojson",
            view,
            "Provinces",
            "rgba(193, 0, 0, 0.4)"
          ).then(() => {
            loadCSVData("/data/transport_stations.csv", view, "#21d375");
          });
        });

        // Create a GraphicsLayer for sketching
        const graphicsLayer = new GraphicsLayer({
          id: "user-sketches",
        });
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
            multipleSelectionEnabled: true,
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
          const selectedGraphics = graphicsLayer.graphics.items.filter(
            (graphic) => graphic.attributes && graphic.attributes.selected
          );
          selectedGraphics.forEach((graphic) => {
            graphicsLayer.remove(graphic);
          });
        };

        // Add the delete button to the view
        view.ui.add(deleteButton, "top-right");

        // Add the Legend widget
        const legend = new Legend({
          view: view,
        });

        view.ui.add(legend, "bottom-left");

        // Add the LayerList widget
        const layerList = new LayerList({
          view: view,
        });

        view.ui.add(layerList, "top-left");

        // Set view in parent component after it is fully initialized
        setView(view);

        // Function to count transport stations within the given geometry
        const countTransportStationsInGeometry = (geometry) => {
          const transportLayer = view.map.findLayerById(
            "transport-stations-layer"
          );
          if (transportLayer) {
            const query = new Query({
              geometry: geometry,
              spatialRelationship: "intersects",
              returnGeometry: false,
              outFields: ["*"],
            });

            transportLayer.queryFeatures(query).then((result) => {
              setChartData({
                labels: ["Transport Stations"],
                values: [result.features.length],
              });
            });
          }
        };

        // Handle Sketch create and update events
        sketch.on("create", (event) => {
          if (event.state === "complete") {
            event.graphic.attributes = { selected: false }; // Initialize selected attribute
            countTransportStationsInGeometry(event.graphic.geometry);
          }
        });

        sketch.on("update", (event) => {
          if (event.state === "complete") {
            countTransportStationsInGeometry(event.graphics[0].geometry);
          }
        });

        // Handle map click for selection
        view.on("click", (event) => {
          view.hitTest(event).then((response) => {
            if (response.results.length) {
              const graphic = response.results.filter(
                (result) => result.graphic.layer === graphicsLayer
              )[0].graphic;
              graphic.attributes.selected = !graphic.attributes.selected;
              graphicsLayer.graphics.items.forEach((g) => {
                if (g !== graphic) g.attributes.selected = false;
              });
            }
          });
        });

        // Handle filtering
        if (filter) {
          const { type, value } = filter;
          let query = "";

          if (type === "region") {
            query = `Region = '${value}'`;
          } else if (type === "province") {
            query = `Province = '${value}'`;
          }

          const transportLayer = view.map.findLayerById(
            "transport-stations-layer"
          );
          if (transportLayer) {
            transportLayer.definitionExpression = query;
          }
        }
      }
    );
  }, [setView, filter, basemap, setChartData]);

  useEffect(() => {
    if (searchLocation && viewRef.current) {
      loadModules([
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/geometry/projection",
        "esri/geometry/SpatialReference",
      ]).then(([Graphic, Point, projection, SpatialReference]) => {
        const point = new Point({
          longitude: searchLocation.longitude,
          latitude: searchLocation.latitude,
          spatialReference: SpatialReference.WGS84,
        });

        projection.load().then(() => {
          const projectedPoint = projection.project(
            point,
            viewRef.current.spatialReference
          );

          const markerSymbol = {
            type: "simple-marker",
            style: "circle",
            color: "red",
            size: "15px",
            outline: {
              color: "white",
              width: 1,
            },
          };

          const pointGraphic = new Graphic({
            geometry: projectedPoint,
            symbol: markerSymbol,
          });

          viewRef.current.graphics.removeAll();
          viewRef.current.graphics.add(pointGraphic);
          viewRef.current.goTo({ target: projectedPoint, zoom: 14 });
        });
      });
    }
  }, [searchLocation]);

  return (
    <div className="map-view" ref={mapRef} style={{ height: "100vh" }}></div>
  );
};

export default MapView;
