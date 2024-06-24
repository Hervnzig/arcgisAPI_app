import React, { useState } from "react";
import "./styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const handleSearch = () => {
    if (longitude && latitude) {
      onSearch({
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      });
    }
  };

  return (
    <div className="search-bar">
      <h3>Search by Coordinates</h3>
      <input
        type="text"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
