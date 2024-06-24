import React, { useState } from "react";

const Filter = ({ onFilter }) => {
  const [filterType, setFilterType] = useState("region");
  const [filterValue, setFilterValue] = useState("");

  const handleFilter = () => {
    onFilter(filterType, filterValue);
  };

  return (
    <div>
      <h3>Filter Transport Stations</h3>
      <select
        onChange={(e) => setFilterType(e.target.value)}
        value={filterType}
      >
        <option value="region">Region</option>
        <option value="province">Province</option>
      </select>
      <input
        type="text"
        placeholder="Enter value"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default Filter;
