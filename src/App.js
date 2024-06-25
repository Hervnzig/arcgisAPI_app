import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import LayerList from "./components/LayerList";
import DataChart from "./components/DataChart";
import Header from "./components/Header";
import DropdownMenu from "./components/DropdownMenu";
import "./App.css";

const App = () => {
  const [view, setView] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [searchLocation, setSearchLocation] = useState(null);
  const [filter, setFilter] = useState(null);
  const [basemap, setBasemap] = useState("streets-vector");
  const [savedSearches, setSavedSearches] = useState([]);
  const [regions, setRegions] = useState([]);

  const saveSearch = (name, polygon, count) => {
    setSavedSearches([...savedSearches, { name, polygon, count }]);
  };

  const handleSelectSearch = (selectedSearch) => {
    if (view && selectedSearch) {
      view.graphics.removeAll();
      view.graphics.add(selectedSearch.polygon);
      setChartData({
        labels: ["Transport Stations"],
        values: [selectedSearch.count],
      });
    }
  };

  useEffect(() => {
    if (view && view.map && view.map.layers) {
      // Update chart data when the map view changes
      const updateChartData = () => {
        const labels = [];
        const values = [];

        view.map.layers.items.forEach((layer) => {
          if (layer.visible) {
            labels.push(layer.title);
            values.push(layer.graphics ? layer.graphics.items.length : 0);
          }
        });

        setChartData({ labels, values });
      };

      view.watch("stationary", updateChartData);
      view.map.layers.on("change", updateChartData);
    }
  }, [view]);

  useEffect(() => {
    // Fetch regions data
    fetch("/data/regions.geojson")
      .then((response) => response.json())
      .then((data) => setRegions(data.features.map((f) => f.properties.name)));
  }, []);

  return (
    <div className="App">
      <Header
        onBasemapChange={setBasemap}
        onSearch={setSearchLocation}
        onFilter={setFilter}
      />
      <MapView
        setView={setView}
        searchLocation={searchLocation}
        filter={filter}
        basemap={basemap}
        setChartData={setChartData}
        chartData={chartData}
        saveSearch={saveSearch}
        regions={regions}
      />
      {view && view.map && view.map.layers && <LayerList view={view} />}
      <div className="chart-popup">
        {view && view.map && view.map.layers && <DataChart data={chartData} />}
      </div>
      <DropdownMenu searches={savedSearches} onSelect={handleSelectSearch} />
    </div>
  );
};

export default App;
