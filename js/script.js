// DOM Elements
const cityContainer = $('.cities');
const form = $('#form');
const submitBtn = $('#submit');
const cityElement = $('#city');
const day = $('.day');
const historyEl = $('#historyItems');
const div = $('<div class="container">');
let history = getStorage();

function getStorage() {
    let items = JSON.parse(localStorage.getItem('history'));
    if (!items) {
        items = [];
    }
    return items;
}

historyEl.text(history);

$('.city').click(function(e) {
    cityElement.val($(e.target).text());
});

let city;
const apiKey = '229984962887c500e20428e36f61f8eb';

function makeHistoryButtons() {
    historyEl.empty();
    history.forEach((city) => {
        const cityButton = $('<button class="historyBtn">');
        cityButton.text(city)
        historyEl.append(cityButton);
        cityButton.click(function(e) {
            let city = cityButton.text();
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
        })
    });
}
makeHistoryButtons();

// Fetch Async Await
async function weatherData() {
    city = cityElement.val();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            day.append(data.name);
            city = city.toLowerCase();
            city = city.charAt(0).toUpperCase() + city.slice(1);
            if (city === '') {
                return
            }
            if (history.includes(city) === false) {
                history.push(city);
                localStorage.setItem('history', JSON.stringify(history));
            };
            results.append();
            console.log(data);
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