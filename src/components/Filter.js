import React, { useState, useEffect } from "react";
import "./styles/Filter.css";

const Filter = ({ onFilter, regions = [] }) => {
  const [filterType, setFilterType] = useState("region");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (regions.length > 0) {
      setFilterValue(regions[0]);
    }
  }, [regions]);

  const handleFilter = () => {
    onFilter({ type: filterType, value: filterValue });
  };

  return (
    <div className="filter">
      <h3>Filter Transport Stations</h3>
      <select
        onChange={(e) => setFilterType(e.target.value)}
        value={filterType}
      >
        <option value="region">Region</option>
      </select>
      <select
        onChange={(e) => setFilterValue(e.target.value)}
        value={filterValue}
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default Filter;
