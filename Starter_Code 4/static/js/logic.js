function createMap(eqMagnitudes) {

    // Create the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the Earthquakes layer.
    let overlayMaps = {
      "Earthquakes": eqMagnitudes
    };
  
    // Create the map object
    let map = L.map("map", {
      center: [39.6433, -106.3781],
      zoom: 5,
      layers: [streetmap, eqMagnitudes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {

    let features = response.features;
  
    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];
  
    // Loop through the features array.
    for (let index = 0; index < features.length; index++) {
      let feature = features[index];
      let coordinates = feature.geometry.coordinates;
      let magnitude = feature.properties.mag;
  
      // Assign colors based on the depth of the earthquake.
      let color = "";
      if (coordinates[2] > 90) {
        color = "darkred";
      } else if (coordinates[2] > 70 && coordinates[2] < 90) {
        color = "red";
      } else if (coordinates[2] > 50 && coordinates[2] < 70) {
        color = "darkorange";
      } else if (coordinates[2] > 30 && coordinates[2] < 50) {
        color = "orange";
      } else if (coordinates[2] > 10 && coordinates[2] < 30) {
        color = "gold";
      } else {
        color = "lightyellow";
      }
      // Create markers for each earthquake and bind a popup with the earthquake's data.
      let markers = L.circle([coordinates[1], coordinates[0]], {
        fillOpacity: 1,
        color: "black",
        weight: 1,
        fillColor: color,
        radius: parseFloat(magnitude) * 10000
      }).bindPopup("<h3>Earthquake Information</h3><hr><p><strong>Magnitude:</strong> " + magnitude + "</p>");
  
      earthquakeMarkers.push(markers);
    }
  
    // Create a layer group and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
  }
  
  // Perform an API call to the 7 day all earthquakes site to get the information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);