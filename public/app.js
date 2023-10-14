
//Create Map
window.onload = async function () {

  myMap.coordinates = await getUserCoordinates();
  console.log(myMap.coordinates);

  myMap.createMap()
  myMap.setUserIcon()
}

let layerGroup;
let userIcon;

const myMap = {
  coordinates: [],
  businesses: [],
  map: {},
  markers: [],


  getMyCoords() {
    return this.coordinates;
  },

  setUserIcon(){
if(userIcon){
  myMap.map.removeLayer(userIcon);
}
    userIcon = L.layerGroup().addTo(myMap.map);
    let myIcon = L.icon({
      iconUrl: './assets/person.png',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60]
    })
    let popup = L.popup().setContent(`<strong>You are here</strong>`);
    L.marker(this.coordinates, { icon: myIcon }).addTo(userIcon).bindPopup(popup);
  },

  changeCoords(){

  },

  createMap() {
    //initialize map at coordinates with zoom 11
    this.map = L.map('map').setView(this.coordinates, 14);

    // 
      this.map.addEventListener('click', (e) => {
        
      this.coordinates = [e.latlng.lat, e.latlng.lng];
   
      this.setUserIcon(this.coordinates);
      console.log(this.coordinates);
      
      });
    //my position marker
    // let popup = L.popup().setContent(`<strong>You are here</strong>`);
    // L.marker(this.coordinates, { icon: myIcon }).addTo(this.map).bindPopup(popup);

    //initialize map tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  },
}
async function getUserCoordinates() {
  let position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);


  });
  return [position.coords.latitude, position.coords.longitude];
}
const dropdown = document.querySelector('select');
let placeArr = dropdown.addEventListener('change', placeSearch);
const searchNutt = document.querySelector('#search');
let searchArr = searchNutt.addEventListener('click', placeSearch);
async function placeSearch() {

  //clear map every time a new search is made if an old search exists
  removeMarkers();

  let limit = document.querySelector('#limit').value;
  if (limit < 1 || limit ===NaN) {
    limit = 5;
  }
  let searchRadius = 5000
  const coords = myMap.coordinates;
  const businessType = dropdown.value;
  try {
    const searchParams = new URLSearchParams({
      query: String(businessType),
      ll: String(coords[0] + ',' + coords[1]),
      radius: String(searchRadius),
      open_now: 'true',
      sort: 'DISTANCE'
    });
    const results = await fetch( //https://cors-anywhere.herokuapp.com/
      `http://localhost:8080/https://api.foursquare.com/v3/places/search?${searchParams}&limit=${limit}&ll=${myMap.coordinates[0]}%2C${myMap.coordinates[1]}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'fsq395VgWRkLBtpL5Hri68Ooif3hQFXFTplNZDR2fLaJiM0=',
        }
      }
    );
    const data = await results.text();
    let parsedData = JSON.parse(data);
    myMap.businesses = parsedData.results;
    console.log("businesses is a ", typeof (myMap.businesses), "type");
    console.log("data inside businesses is a ", myMap.businesses, "type");
    myMap.businesses = await processBuss(myMap.businesses);
    createMarkers(myMap.businesses);
    return myMap.businesses;

  } catch (err) {
    console.error(err);
  }
}

async function processBuss(data) {
  let buss = await data.map((e) => ({
    name: e.name,
    lat: e.geocodes.main.latitude,
    lon: e.geocodes.main.longitude,
    distance: e.distance/1000,
    address: e.location.address,

  }));
  console.log(buss);
  return buss;
}

function createMarkers(buss) {
  layerGroup = L.layerGroup().addTo(myMap.map);
  for (let i = 0; i < buss.length; i++) {

    let bussData = buss[i].name;

    if (dropdown.value === "restaurants") {

      let restaurantIcon = L.icon({
        iconUrl: './assets/restaurant.png',
        iconSize: [40, 60],
        iconAnchor: [20, 60],
        popupAnchor: [0, -60]
      })

      myMap.markers = L.marker([buss[i].lat, buss[i].lon], { icon: restaurantIcon })
        .addTo(layerGroup)
        .bindPopup(bussData + "\n" + buss[i].distance)
    }
    else if (dropdown.value === "coffee") {

      let coffeeIcon = L.icon({
        iconUrl: './assets/coffee.png',
        iconSize: [60, 60],
        iconAnchor: [30, 60],
        popupAnchor: [0, -60]
      })

      myMap.markers = L.marker([buss[i].lat, buss[i].lon], { icon: coffeeIcon })
        .addTo(layerGroup)
        .bindPopup(buss[i].name)
    }
    else if (dropdown.value === "hotel") {

      let hotelIcon = L.icon({
        iconUrl: './assets/hotel.png',
        iconSize: [60, 60],
        iconAnchor: [30, 60],
        popupAnchor: [0, -60]
      })

      myMap.markers = L.marker([buss[i].lat, buss[i].lon], { icon: hotelIcon })
        .addTo(layerGroup)
        .bindPopup(buss[i].name)
    }
    else if (dropdown.value === "market") {

      let marketIcon = L.icon({
        iconUrl: './assets/market.png',
        iconSize: [60, 60],
        iconAnchor: [30, 60],
        popupAnchor: [0, -60]
      })

      myMap.markers = L.marker([buss[i].lat, buss[i].lon], { icon: marketIcon })
        .addTo(layerGroup)
        .bindPopup(buss[i].name)
    }
  }
  console.log("data inside of markers is a ", myMap.markers);
}

function removeMarkers() {
  if (myMap.businesses.length > 0) {

    myMap.map.removeLayer(layerGroup);

  }
}
