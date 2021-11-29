// DOM Elements
const cityContainer = $('.cities');
const form = $('#form');
const submitBtn = $('#submit');
const cityElement = $('#city');
const day = $('.day');
const dayForecast = $('.dayForecast');
const weekForecast = $('.weekForecast');
const historyEl = $('#historyItems');
const div = $('<div class="container">');
// Date
let d = new Date;
let month = d.getMonth() + 1;
let x = d.getDate();
let year = d.getFullYear();
let date = '(' + month + '/' + x + '/' + year + ')';
// History
let history = getStorage();

function getStorage() {
    try {
        let items = JSON.parse(localStorage.getItem('history'));
        if (!items) {
            items = [];
        }
        return items;
    } catch (error) {

    }
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
        cityButton.dblclick(function() {
            $(this).remove();
            // localStorage.setItem('history', history);
            console.log(history);
        });
        cityButton.click(function(e) {
            dayForecast.text('');
            weekForecast.text('');
            let city = cityButton.text();
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    city = data.name;
                    day.text(city + ' ' + date).addClass('current');
                    dayForecast.append(data.weather[0].description);
                    let lon = data.coord.lon;
                    let lat = data.coord.lat;
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            for (let i = 0; i < 5; i++) {
                                let icon = data.list[i].weather[0].icon;
                                let img = $(`<img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png">`);
                                weekForecast.append(img);
                            }

                        });
                });
        });
    });
}
makeHistoryButtons();

// // Fetch Async Await
async function weatherData() {
    dayForecast.text('');
    weekForecast.text('');
    city = cityElement.val();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            city = city.toLowerCase();
            city = city.charAt(0).toUpperCase() + city.slice(1);
            if (city === '') {
                return
            }
            if (history.includes(city) === false) {
                history.push(city);
                localStorage.setItem('history', JSON.stringify(history));
            };
            historyEl.text(history);
            makeHistoryButtons();
            weekForecast.empty();
            city = data.name;
            day.text(city + ' ' + date).addClass('current');
            dayForecast.append(data.weather[0].description);
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    for (let i = 0; i < 5; i++) {
                        let icon = data.list[i].weather[0].icon;
                        let img = $(`<img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png">`);
                        weekForecast.append(img);
                    }

                });
        });
    console.log(history);
}

form.submit(function(e) {
    e.preventDefault();
    weatherData();
});