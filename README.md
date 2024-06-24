# ArcGIS API Web Application

This web application allows users to interact with an interactive map using the ArcGIS API. Users can create, modify, and delete geometries, manage layers, and visualize data related to transport stations.

## Features

- **Interactive Map**: Display map with different basemap options.
- **Geometry Creation and Modification**: Tools for creating, modifying, and deleting points, lines, and polygons.
- **Attribute and Geometry Modification**: Modify geometry and attributes of existing objects.
- **Layer Management**: View and manage layers created by users.
- **Data Visualization**: Create charts to visualize data from the map.
- **Search by Coordinates**: Search for locations using latitude and longitude.

## Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm start
   ```

4. **Open the Application**
   Open your web browser and navigate to `http://localhost:3000`

## File Structure

```bash
 .
 ├── .gitignore
 ├── README.md
 ├── package-lock.json
 ├── package.json
 ├── public
 │ ├── data
 │ │ ├── provinces.geojson
 │ │ ├── regions.geojson
 │ │ └── transport_stations.csv
 │ ├── favicon.ico
 │ ├── index.html
 │ ├── logo192.png
 │ ├── logo512.png
 │ ├── manifest.json
 │ └── robots.txt
 └── src
 ├── components
 │ ├── BasemapSelector.js
 │ ├── DataChart.js
 │ ├── Filter.js
 │ ├── LayerList.js
 │ ├── MapView.js
 │ ├── SearchBar.js
 │ └── Header.js
 ├── App.css
 ├── App.js
 ├── App.test.js
 ├── dataLoader.js
 ├── index.css
 ├── index.js
 ├── logo.svg
 ├── reportWebVitals.js
 └── setupTests.js
```

## Current Features

1. **Interactive Map**

   - Display map with different basemap options.
   - Enable panning and zooming functionality.

2. **Geometry Creation and Modification**

   - Tools for creating, modifying, and deleting points, lines, and polygons.
   - Sketch widget for creating and updating geometries.

3. **Attribute and Geometry Modification**

   - Modify geometry and attributes of existing objects.
   - Selection of geometries to view and edit attributes.

4. **Layer Management**

   - View and manage layers created by users.
   - Toggle visibility of layers.

5. **Data Visualization**

   - Create charts to visualize data from the map.
   - Ensure queries and filters update both the map and the charts.

6. **Search by Coordinates**
   - Search for locations using latitude and longitude.
   - Mark search results on the map.

## Contributing

Feel free to submit issues and pull requests. We welcome contributions from the community!

## License

This project is licensed under the MIT License. See the LICENSE file for details.
