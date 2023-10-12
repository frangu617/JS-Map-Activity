
//Create Map
window.onload = async function () {

  let coords = await getUserCoordinates();
  console.log(coords);

  createMap(coords)
}
function createMap(coords) {
  const myMap = L.map('map').setView(coords,12);
  let popup = L.popup().setContent('Coordinates: ' + coords[0] + ', ' + coords[1]);
  L.marker(coords).addTo(myMap).bindPopup(popup);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(myMap);
}
async function getUserCoordinates() {
  let position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);


  });
  return [position.coords.latitude, position.coords.longitude];

}
const dropdown = document.querySelector('select');
let placeArr = dropdown.addEventListener('change', placeSearch);

// optionFinder();

//  createMap(myCoords);
// async function findFood(coords){
//   const userCoords = coords;
//   const ad2Div = document.querySelector('.ad2');
//   const p = document.createElement('p');
//   const href = `https://www.google.com/maps/search/food/@${userCoords[0]},${userCoords[1]}`;
//   p.innerHTML = `It is time for a cup of coffee! <a href="${href}">Here are some awesome coffee shops near you</a>. Enjoy!`;
//   ad2Div.appendChild(p);
// }

// async function optionFinder() {
//   // const businessType = dropdown.value;
// console.log(businessType);
// let coords = await getUserCoordinates();

//   // Make an API call to get a list of businesses of the selected type.
//   const businesses = await fetch(`https://nominatim.openstreetmap.org/search?q=${businessType}&format=json&bounded=${coords},${coords}`);

//   // Filter the list of businesses by type and distance.
//   const filteredBusinesses = businesses.filter((business) => {
//     return business.type === businessType && business.distance < 5000;
//   });

//   // Add the businesses to the Leaflet map.
//   filteredBusinesses.forEach(business => {
//     const marker = L.marker([business.lat, business.lon]).addTo(myMap);
//     marker.bindPopup(business.display_name);
//   });
// }

async function placeSearch() {
  const coords = await getUserCoordinates();
  const businessType = dropdown.value;
  try {
      const searchParams = new URLSearchParams({
        query: String(businessType),
        ll: String(coords[0] + ',' + coords[1]),
        radius: '1000',
        open_now: 'true',
        sort: 'DISTANCE'
      });
      const results = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?${searchParams}`,
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
      return businesses;
  } catch (err) {
      console.error(err);
  }
}

function processBuss(data) {
  let business = data.map((e) => {
    
  })
}
