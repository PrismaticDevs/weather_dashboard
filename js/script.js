// DOM Elements
const cityContainer = $('.cities');
const form = $('#form');
const submitBtn = $('#submit');
const cityElement = $('#city');
const results = $('#results');
const historyEl = $('#historyItems');
const history = [];
const div = $('<div class="container">');

$('.city').click(function(e) {
    cityElement.val($(e.target).text());
});

let city;
// API Key
const apiKey = '229984962887c500e20428e36f61f8eb';
// Fetch Async Await
async function weatherData() {
    city = cityElement.val();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log(data);
                let sky = JSON.stringify(data.weather[0].description)
                let cityName = JSON.stringify(data.name)
                results.append(div).html(cityName);
                city = city.charAt(0).toUpperCase() + city.slice(1);;
                if (history.includes(city) === false) history.push(city);;
                historyEl.text(history);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

form.submit(function(e) {
    e.preventDefault();
    weatherData();
});