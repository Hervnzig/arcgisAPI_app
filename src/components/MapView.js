import React, { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";
import { loadGeoJSONData, loadCSVData } from "./dataLoader";

const MapView = ({
  setView,
  searchLocation,
  basemap = "streets-vector",
  setChartData,
  saveSearch,
  chartData,
  filter,
  regions,
}) => {
  const mapRef = useRef();
  const viewRef = useRef();
  const layerListRef = useRef(false); // Add useRef to track LayerList widget
  const [selectedGraphic, setSelectedGraphic] = useState(null);
  const [attributes, setAttributes] = useState({
    name: "",
    type: "",
    capacity: "",
  });
  const [polygonName, setPolygonName] = useState("");

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
        "esri/geometry/geometryEngine",
        "esri/rest/support/Query",
        "esri/widgets/LayerList",
      ],
      { css: true }
    )
      .then(
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
          geometryEngine,
          Query,
          LayerList,
        ]) => {
          const webMap = new WebMap({
            basemap: basemap || "streets-vector",
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
              loadCSVData("/data/transport_stations.csv", view, "green");
            });
          });

          // Create a GraphicsLayer for sketching and add it to the top
          const graphicsLayer = new GraphicsLayer({
            id: "user-sketches",
          });
          webMap.add(graphicsLayer);

          // Ensure the graphicsLayer is the top layer
          webMap.layers.reorder(graphicsLayer, 0);

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
            setSelectedGraphic(null); // Clear selection
          };

          // Add the delete button to the view
          view.ui.add(deleteButton, "top-right");

          // Add the Legend widget
          const legend = new Legend({
            view: view,
          });

          view.ui.add(legend, "bottom-left");

          // Add the LayerList widget only once
          if (!layerListRef.current) {
            // Check if LayerList is already added
            const layerList = new LayerList({
              view: view,
            });
            view.ui.add(layerList, "top-left");
            layerListRef.current = true; // Set ref to true after adding LayerList
          }

          // Set view in parent component after it is fully initialized
          setView(view);

          // Function to count transport stations within the given geometry
          const countTransportStationsInGeometry = (geometry) => {
            const transportLayer = view.map.layers.find(
              (layer) => layer.title === "Transport Stations"
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
              event.graphic.attributes = {
                selected: false,
                name: "",
                type: "",
                capacity: "",
              }; // Initialize attributes
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
                const result = response.results.filter(
                  (result) => result.graphic.layer === graphicsLayer
                )[0];
                if (result) {
                  const graphic = result.graphic;
                  graphic.attributes.selected = !graphic.attributes.selected;
                  graphicsLayer.graphics.items.forEach((g) => {
                    if (g !== graphic) g.attributes.selected = false;
                  });
                  setSelectedGraphic(graphic);
                  setAttributes(graphic.attributes); // Set attributes for editing
                }
              }
            });
          });
        }
      )
      .catch((error) => {
        console.error("ArcGIS API loading error: ", error);
      });
  }, [setView, setChartData, basemap]);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.map.basemap = basemap;
    }
  }, [basemap]);

  useEffect(() => {
    if (searchLocation && viewRef.current) {
      loadModules([
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/geometry/projection",
        "esri/geometry/SpatialReference",
      ])
        .then(([Graphic, Point, projection, SpatialReference]) => {
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
        })
        .catch((error) => {
          console.error("Error projecting point: ", error);
        });
    }
  }, [searchLocation]);

  useEffect(() => {
    if (filter && viewRef.current) {
      const applyFilter = async () => {
        const [Query, Graphic] = await loadModules([
          "esri/rest/support/Query",
          "esri/Graphic",
        ]);

        const regionsLayer = viewRef.current.map.layers.find(
          (layer) => layer.title === "Regions"
        );

        const transportLayer = viewRef.current.map.layers.find(
          (layer) => layer.title === "Transport Stations"
        );

        if (regionsLayer && transportLayer) {
          const query = new Query({
            where: `name = '${filter.value}'`,
            returnGeometry: true,
            outFields: ["*"],
          });

          const result = await regionsLayer.queryFeatures(query);

          if (result.features.length > 0) {
            const regionGeometry = result.features[0].geometry;
            const transportQuery = new Query({
              geometry: regionGeometry,
              spatialRelationship: "intersects",
              returnGeometry: true,
              outFields: ["*"],
            });

            const transportResult = await transportLayer.queryFeatures(
              transportQuery
            );
            viewRef.current.graphics.removeAll();

            transportResult.features.forEach((feature) => {
              const graphic = new Graphic({
                geometry: feature.geometry,
                symbol: {
                  type: "simple-marker",
                  style: "circle",
                  color: "green",
                  size: "10px",
                  outline: {
                    color: "white",
                    width: 0.4,
                  },
                },
                attributes: feature.attributes,
              });
              viewRef.current.graphics.add(graphic);
            });

            setChartData({
              labels: ["Transport Stations"],
              values: [transportResult.features.length],
            });
          }
        }
      };
      applyFilter();
    }
  }, [filter, setChartData]);

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setAttributes((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeSave = () => {
    if (selectedGraphic) {
      selectedGraphic.attributes = attributes;
      setSelectedGraphic(null); // Clear selection after saving
    }
  };

  return (
    <div className="map-view-container">
      <div className="map-view" ref={mapRef} style={{ height: "100vh" }}></div>
      {selectedGraphic && (
        <div className="attribute-editor">
          <h3>Edit Attributes</h3>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={attributes.name}
              onChange={handleAttributeChange}
            />
          </label>
          <label>
            Type:
            <input
              type="text"
              name="type"
              value={attributes.type}
              onChange={handleAttributeChange}
            />
          </label>
          <label>
            Capacity:
            <input
              type="text"
              name="capacity"
              value={attributes.capacity}
              onChange={handleAttributeChange}
            />
          </label>
          <button onClick={handleAttributeSave}>Save</button>
        </div>
      )}
      <div className="save-polygon">
        <h3>Save Polygon</h3>
        <label>
          Polygon Name:
          <input
            type="text"
            value={polygonName}
            onChange={(e) => setPolygonName(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            if (selectedGraphic && polygonName) {
              saveSearch(
                polygonName,
                selectedGraphic.geometry,
                chartData.values[0]
              );
              setPolygonName("");
              setSelectedGraphic(null);
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MapView;
