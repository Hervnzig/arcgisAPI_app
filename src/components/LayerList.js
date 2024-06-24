import React from "react";
import { loadModules } from "esri-loader";

const LayerList = ({ view }) => {
  const [layers, setLayers] = React.useState([]);

  React.useEffect(() => {
    loadModules(["esri/widgets/LayerList"]).then(([LayerList]) => {
      const layerList = new LayerList({
        view: view,
        container: document.createElement("div"),
      });

      view.ui.add(layerList, "top-left");

      // Set layers state
      setLayers(view.map.layers.items);
    });
  }, [view]);

  return (
    <div>
      <h3>Layer Management</h3>
      <ul>
        {layers.map((layer) => (
          <li key={layer.id}>
            <input
              type="checkbox"
              checked={layer.visible}
              onChange={() => {
                layer.visible = !layer.visible;
                setLayers([...layers]);
              }}
            />
            {layer.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayerList;
