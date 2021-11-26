// DOM Elements
const cityContainer = $('.cities');
const form = $('#form');
const submitBtn = $('#submit');
const cityElement = $('#city');
const results = $('#results');
const historyEl = $('#historyItems');
const div = $('<div class="container">');
let history = getStorage();
makeHistoryButtons();

function getStorage() {
    let items = JSON.parse(localStorage.getItem('history'));
    if (!items) {
        items = [];
    }
    return items;
}

historyEl.text(history);


console.log(history);

$('.city').click(function(e) {
    cityElement.val($(e.target).text());
});

let city;
const apiKey = '229984962887c500e20428e36f61f8eb';

function makeHistoryButtons() {
    historyEl.empty();
    history.forEach((city) => {
        const cityButton = $('<button>');
        cityButton.text(city)
        historyEl.append(cityButton);
    });
}

// Fetch Async Await
async function weatherData() {
    city = cityElement.val();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            results.text(data.name);
            history.push(city);
            localStorage.setItem('history', JSON.stringify(history));
            makeHistoryButtons();
        })
        .catch((error) => {
            console.error(error);
        });
}

form.submit(function(e) {
    e.preventDefault();
    weatherData();
});