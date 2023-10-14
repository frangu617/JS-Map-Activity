
//Create Map
window.onload = async function () {

  myMap.coordinates = await getUserCoordinates();

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

  setUserIcon() {
    if (userIcon) {
      myMap.map.removeLayer(userIcon);
    }
    userIcon = L.layerGroup().addTo(myMap.map);
    let myIcon = L.icon({
      iconUrl: './assets/person.png',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60]
    })
    let popup = L.popup().setContent(`<h2>You are here</h2>`);
    L.marker(this.coordinates, { icon: myIcon }).addTo(userIcon).bindPopup(popup);
  },

  changeCoords() {

  },

  createMap() {
    //initialize map at coordinates with zoom 11
    this.map = L.map('map').setView(this.coordinates, 14);

    // 
    this.map.addEventListener('click', (e) => {

      this.coordinates = [e.latlng.lat, e.latlng.lng];

      this.setUserIcon(this.coordinates);

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
let resetMarks = document.querySelector('#reset');
let resetButt = resetMarks.addEventListener('click', removeMarkers);
async function placeSearch() {

  //clear map every time a new search is made if an old search exists
  removeMarkers();

  let limit = document.querySelector('#limit').value;
  if (limit < 1 || limit === NaN) {
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
    /////////////////////////////////////////////////////////////////////
    // Change this next part when grading to what you need it to work, i cloned the repo for cors-anywhere and made a local server for me to try this

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
    ////////////////////////////////////////////////////////////////////
    const data = await results.text();
    let parsedData = JSON.parse(data);
    myMap.businesses = parsedData.results;
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
    distance: e.distance / 1000,
    address: e.location.address,
  }));
  return buss;
}

function createMarkers(buss) {
  layerGroup = L.layerGroup().addTo(myMap.map);
  for (let i = 0; i < buss.length; i++) {

    let bussData = `<h2>${buss[i].name}  </h2> <p style = 'font-size: 13px;'> ${buss[i].address} </br> ${buss[i].distance} Miles away </p>`;

    let thisIcon = L.icon({
      iconUrl: `./assets/${dropdown.value}.png`,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60]
    })
    myMap.markers = L.marker([buss[i].lat, buss[i].lon], { icon: thisIcon })
      .addTo(layerGroup)
      .bindPopup(bussData)
  }
}

function removeMarkers() {
  if (myMap.businesses.length > 0) {
    myMap.map.removeLayer(layerGroup);
  }
}
