import React from "react";
import "./styles/BasemapSelector.css";

const BasemapSelector = ({ onBasemapChange }) => {
  const handleBasemapChange = (event) => {
    onBasemapChange(event.target.value);
  };

  return (
    <div className="basemap-selector">
      <h3>Select Basemap</h3>
      <select onChange={handleBasemapChange}>
        <option value="streets">Streets</option>
        <option value="satellite">Satellite</option>
        <option value="topo">Topographic</option>
        <option value="hybrid">Hybrid</option>
        <option value="dark-gray">Dark Gray</option>
        <option value="gray">Gray</option>
        <option value="national-geographic">National Geographic</option>
        <option value="terrain">Terrain</option>
        <option value="osm">OpenStreetMap</option>
      </select>
    </div>
  );
};

export default BasemapSelector;
