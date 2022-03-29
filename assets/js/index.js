  // initialize Leaflet
  var map = L.map('map').setView({lon: 0, lat: 0}, 2);

  // add the OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  // show the scale bar on the lower left corner
  L.control.scale({imperial: true, metric: true}).addTo(map);

  // show a marker on the map
  L.marker({lon: 0, lat: 0}).bindPopup('The center of the world').addTo(map);



const geoData= [];

function loadGeoData(){

    fetch('/assets/json/europe.geo.json').then(response => {
        return response.json();
      }).then(data => {
        // Work with JSON data here
        generate_countries_list(data);
       
      }).catch(err => {
        // Do something for an error here
      });
    
}







function generate_countries_list(json_data){
    var countries_list = document.getElementById("countries-list");

    const features = json_data['features'];
    for(let  i = 0; i < features.length; i++){
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


function getCountryProperties(wb_a2_to_search){

    const feature_properties = [];
    fetch('/assets/json/europe.geo.json').then(response => {
        return response.json();
      }).then(data => {
        // Work with JSON data here
        const features = data['features'];
        for(let  i = 0; i < features.length; i++){
            const properties = features[i]['properties'];
            const wb_a2 = properties['wb_a2'];
         
            if(wb_a2 == wb_a2_to_search){
                console.log('found ' + wb_a2 + '==' + wb_a2_to_search)
                feature_properties = properties;
            
            }
        }
       
      }).catch(err => {
        // Do something for an error here
      });
     
      console.log(feature_properties);
    return feature_properties;

}

function addCountryPolygonToMap(id){
    const countryProperties = getCountryProperties(id);
  
    if(countryProperties != -99){
       
        L.geoJSON(countryProperties).addTo(map);
    }
    
}




loadGeoData();


