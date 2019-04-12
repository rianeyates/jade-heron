var map = L.map('map', {
  center: [30.27, -97.75],
  zoom: 12
});

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'rianeyates'
});

// Initialze source data
var source = new carto.source.Dataset('austin_airbnb_moguls');

// Create style for the data
var style = new carto.style.CartoCSS(`
  #layer {
    marker-width: 6.5;
    marker-fill: #da2222;
    marker-fill-opacity: 1;
    marker-allow-overlap: true;
    marker-line-width: 1;
    marker-line-color: #FFFFFF;
    marker-line-opacity: 1;
  }
`);

// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['price', 'host_name','host_listings_count']
});

layer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h1>' + event.data['host_name'] + '</h1>';
  content += '<h3>HAS ' + event.data['host_listings_count'] + ' UNITS LISTED ON AIRBNB</h3>';
  
  // If you're not sure what data is available, log it out:
  console.log(event.data);
  
  var popup = L.popup();
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);



