import React from "react";

const DropdownMenu = ({ searches, onSelect }) => {
  const handleSelect = (event) => {
    const selectedIndex = event.target.value;
    const selectedSearch = searches[selectedIndex];
    onSelect(selectedSearch);
  };

  return (
    <div className="dropdown-menu">
      <h3>Select Saved Search</h3>
      <select onChange={handleSelect}>
        <option value="">Select a search...</option>
        {searches.map((search, index) => (
          <option key={index} value={index}>
            {search.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
