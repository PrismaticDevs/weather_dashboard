// DOM Elements
const cityContainer = $('.cities');
const form = $('#form');
const submitBtn = $('#submit');
const cityElement = $('#city');
const results = $('#results');
const historyEl = $('#historyItems');
const history = [];

$('.city').click(function(e) {
    cityElement.val($(e.target).text());
});

let city;
let searched = false;
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
            console.log(data.weather);
            results.text(JSON.stringify(data));
        })
        .catch(err => {
            console.error(err);
        });
    searched = true;
    console.log(searched);
}

form.submit(function(e) {
    e.preventDefault();
    weatherData();
    if (history.includes(city)) {
        console.log('dalready searched ');
        return;
    } else {
        console.log('push to history');
        history.push(city);
    }
    historyEl.text(history);
});