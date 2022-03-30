// initialize Leaflet
var map = L.map('map').setView({ lon: 0, lat: 0 }, 2);
var counter = 0;
// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale({ imperial: true, metric: true }).addTo(map);
counter++;
// show a marker on the map
//L.marker({ lon: 0, lat: 0 }).bindPopup('The center of the world').addTo(map);



const geoDataAdded = new Array(39);

function loadGeoData() {

  fetch('/assets/json/europe.geo.json').then(response => {
    return response.json();
  }).then(data => {
    // Work with JSON data here
    generate_countries_list(data);

  }).catch(err => {
    // Do something for an error here
  });

}







function generate_countries_list(json_data) {
  var countries_list = document.getElementById("countries-list");

  const features = json_data['features'];
  for (let i = 0; i < features.length; i++) {
    var list_element = document.createElement('li');
    list_element.setAttribute("class", "list-element");
    const feuture_properties = features[i]['properties'];

    const wb_a2 = feuture_properties['wb_a2'];
    list_element.setAttribute("id", wb_a2);
    list_element.setAttribute("onclick", "addCountryPolygonToMap(this.id)");
    const formal_en = feuture_properties['formal_en'];
    list_element.innerHTML = formal_en;



    countries_list.appendChild(list_element);
  }
}


function addCountryToMap(wb_a2_to_search) {
 
  var feature_properties = [];
  fetch('/assets/json/europe.geo.json').then(response => {
    return response.json();
  }).then(data => {
    // Work with JSON data here
    var features = data['features'];
    for (let i = 0; i < features.length; i++) { 
      var properties = features[i]['properties'];
      var wb_a2 = properties['wb_a2'];
     
      if (wb_a2 == wb_a2_to_search) {
        geoDataAdded[i] = true;
        L.geoJSON(features[i]).addTo(map);
        
       break;
      
      }
    }

  }).catch(err => {
    // Do something for an error here
  });

 

}

function addCountryPolygonToMap(id) {
  if(geoDataAdded.includes(id)){
  
    showPopUp();
  // removeCountry(id);
  }else{
  
    geoDataAdded.push(id);
    addCountryToMap(id);
  }
  


}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function showPopUp(){
 
  document.getElementById('title').innerHTML = 'Country Already Added!';
  delay(2000).then(() => document.getElementById('title').innerHTML = 'Welcome to my interactive map!');
   
}
/*
function removeCountry(wb_a2_to_search){
  var feature_properties = [];
  fetch('/assets/json/europe.geo.json').then(response => {
    return response.json();
  }).then(data => {
    // Work with JSON data here
    var features = data['features'];
    for (let i = 0; i < features.length; i++) { 
      var properties = features[i]['properties'];
      var wb_a2 = properties['wb_a2'];
     
      if (wb_a2 == wb_a2_to_search) {
        const index = geoDataAdded.indexOf(wb_a2_to_search);
        if (index > -1) {
          geoDataAdded.splice(index, 1); // 2nd parameter means remove one item only
        }
       
     
       
      // L.geoJSON(features[i]).clearLayer();
      //  feature_properties = ;

    
    }  
       break;
      
      }
    }

  ).catch(err => {
    // Do something for an error here
  });
}*/



function clearMap(){
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
});



// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// show the scale bar on the lower left corner
if(counter == 0){
  L.control.scale({ imperial: true, metric: true }).addTo(map);
  counter++;
}


while(geoDataAdded.length > 0) {
  geoDataAdded.pop();
}
}

loadGeoData();


