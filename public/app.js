
//Create Map
window.onload = async function () {

  myMap.coordinates = await getUserCoordinates();
  console.log(myMap.coordinates);

  myMap.createMap()
}
let layerGroup;
const myMap = {
  coordinates: [],
  businesses: [],
  map: {},
  markers: {},


  getMyCoords() {
    return this.coordinates;
  },

  createMap() {
    //initialize map at coordinates with zoom 11
    this.map = L.map('map').setView(this.coordinates, 14);

    let myIcon = L.icon({
      iconUrl: './assets/person.png',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60]
    })
    //my position marker
    let popup = L.popup().setContent(`<strong>You are here</strong>`);
    L.marker(this.coordinates, { icon: myIcon }).addTo(this.map).bindPopup(popup);

    //initialize map tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }


}
async function getUserCoordinates() {
  let position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);


  });
  return [position.coords.latitude, position.coords.longitude];

}
const dropdown = document.querySelector('select');
let placeArr = dropdown.addEventListener('change', placeSearch);

async function placeSearch() {

  removeMarkers(myMap.markers)
  const coords = await getUserCoordinates();
  const businessType = dropdown.value;
  try {
    const searchParams = new URLSearchParams({
      query: String(businessType),
      ll: String(coords[0] + ',' + coords[1]),
      radius: '5000',
      open_now: 'true',
      sort: 'DISTANCE'
    });
    const results = await fetch( //https://cors-anywhere.herokuapp.com/
      `http://localhost:8080/https://api.foursquare.com/v3/places/search?${searchParams}&limit=5&ll=${myMap.coordinates[0]}%2C${myMap.coordinates[1]}`,
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
    let businesses = parsedData.results;
    businesses = await processBuss(businesses);
    createMarkers(businesses);
    return businesses;

  } catch (err) {
    console.error(err);
  }
}

async function processBuss(data) {
  let buss = await data.map((e) => ({
    name: e.name,
    lat: e.geocodes.main.latitude,
    lon: e.geocodes.main.longitude,

  }));
  console.log(buss);
  return buss;
}

function createMarkers(buss) {
  layerGroup = L.layerGroup().addTo(myMap.map);
  for (let i = 0; i < 5; i++) {
    if (dropdown.value === "restaurants") {

      let restaurantIcon = L.icon({
        iconUrl: './assets/restaurant.png',
        iconSize: [40, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60]
      })

      let markers = L.marker([buss[i].lat, buss[i].lon], { icon: restaurantIcon })
        .addTo(layerGroup)
        .bindPopup(buss[i].name)
    }
    else if (dropdown.value === "coffee") {

      let coffeeIcon = L.icon({
        iconUrl: './assets/coffee.png',
        iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60]
      })

      let markers = L.marker([buss[i].lat, buss[i].lon], { icon: coffeeIcon })
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

      let markers = L.marker([buss[i].lat, buss[i].lon], { icon: hotelIcon })
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

      let markers = L.marker([buss[i].lat, buss[i].lon], { icon: marketIcon })
        .addTo(layerGroup)
        .bindPopup(buss[i].name)
    }
    // let markers = L.marker([buss[i].lat, buss[i].lon])
    // .addTo(layerGroup)
    // .bindPopup(buss[i].name)

  }
}

function removeMarkers(marker) {



  console.log("after removal: " + myMap.markers)
}