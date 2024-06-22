import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import LayerList from "./LayerList";
import DataChart from "./DataChart";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import BasemapSelector from "./BasemapSelector";

const App = () => {
  const [view, setView] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [searchLocation, setSearchLocation] = useState(null);
  const [filter, setFilter] = useState(null);
  const [basemap, setBasemap] = useState("streets");

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

  return (
    <div className="App">
      <BasemapSelector onBasemapChange={setBasemap} />
      <SearchBar onSearch={setSearchLocation} />
      <Filter onFilter={setFilter} />
      <MapView
        setView={setView}
        searchLocation={searchLocation}
        filter={filter}
        basemap={basemap}
      />
      {view && view.map && view.map.layers && <LayerList view={view} />}
      {view && view.map && view.map.layers && <DataChart data={chartData} />}
    </div>
  );
};

export default App;
