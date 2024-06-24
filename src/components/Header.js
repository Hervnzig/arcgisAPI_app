import React from "react";
import BasemapSelector from "./BasemapSelector";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import "./styles/Header.css";

const Header = ({ onBasemapChange, onSearch, onFilter }) => {
  return (
    <header className="header">
      <div className="header-section">
        <BasemapSelector onBasemapChange={onBasemapChange} />
      </div>
      <div className="header-section">
        <SearchBar onSearch={onSearch} />
      </div>
      <div className="header-section">
        <Filter onFilter={onFilter} />
      </div>
    </header>
  );
};

export default Header;
