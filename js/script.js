// DOM Elements
const cityContainer = $('.cities');
const form = $('#form');
const submitBtn = $('#submit');
const city = $('#city');


const cities = ['Atlanta', 'Austin', 'Chicago', 'Denver', 'New York City', 'Orlando', 'San Francisco', 'Seattle'];

for (let i = 0; i < cities.length; i++) {
    const element = cities[i];
    cityContainer.append(`<button class="city">${cities[i]}</button>`)
}

$('.city').click(function(e) {
    city.val($(e.target).text());
});

// Latitudes
const lat = [33.753746, 30.266666, 41.881832, 39.742043, 40.730610, 28.53834, 37.773972, 47.60621];
// Longitudes
const lon = [-84.386330, -97.733330, -87.623177, -104.991531, -73.935242, -81.37924, -122.431297, -122.33207];
// Dummy Data
const springsLon = '-104.800644';
const springsLat = '38.846127';
// API Key
const apiKey = '229984962887c500e20428e36f61f8eb';
// Fetch Async Await
let daily;
async function weatherData() {
    response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${springsLat}&lon=${springsLon}&appid=${apiKey}`);
    if (response.ok) {
        let json = await response.json();
        daily = json.daily;
        console.log(daily);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

form.submit(function(e) {
    e.preventDefault();
    weatherData();
});