import React, { useState, useEffect } from "react";
import "./styles/EditForm.css";

const EditForm = ({ selectedGraphic, onUpdate }) => {
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    if (selectedGraphic) {
      setAttributes(selectedGraphic.attributes);
    }
  }, [selectedGraphic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttributes({
      ...attributes,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(attributes);
  };

  if (!selectedGraphic) {
    return <div className="edit-form">Select a graphic to edit</div>;
  }

  return (
    <div className="edit-form">
      <h3>Edit Attributes</h3>
      <form onSubmit={handleSubmit}>
        {Object.keys(attributes).map((key) => (
          <div key={key} className="form-group">
            <label>{key}</label>
            <input
              type="text"
              name={key}
              value={attributes[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditForm;
