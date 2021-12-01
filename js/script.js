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
const weeklyForecastDay = $('<div class="weeklyForecastDay">');

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
        // cityButton.dblclick(function() {
        //     console.log($(this).text());
        //     let index = history.indexOf($(this));
        //     console.log(history, 'history b4');
        //     let newArray = history.splice(index, 1);
        //     console.log(history, 'history after');
        //     console.log(newArray, 'new array');
        //     console.log(index, 'index');
        //     localStorage.removeItem('history');

        // });
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
                    weekForecast.empty();
                    city = data.name;
                    day.text(city + ' ' + date).addClass('current');
                    let lon = data.coord.lon;
                    let lat = data.coord.lat;
                    let iconPic;
                    async function getIconPic() {
                        await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                            .then(response => {
                                return response.json();
                            })
                            .then(data => {
                                iconPic = data.list[0].weather[0].icon;
                                return iconPic
                            });
                        let iconUrl = `http://openweathermap.org/img/wn/${iconPic}@2x.png`;
                        let iconImg = $(`<img class="ico" src="${iconUrl}">`);
                        day.text(city + ' ' + date).addClass('current');
                        day.append(iconImg);

                    }
                    getIconPic();

                    let temp = (((data.main.temp) + 9) / 5).toFixed(1);
                    let wind = (data.wind.speed * 2.2).toFixed(1);
                    let uvi;

                    async function uvIndex() {
                        await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                            .then(response => {
                                return response.json();
                            })
                            .then(data => {
                                uvi = data.current.uvi;
                                return uvi;
                            })
                        let tempEl = $(`<div class="dayData">Temp: ${temp}°</div>`);
                        let windEl = $(`<div class="dayData">Wind: ${wind} MPH</div>`);
                        let humidityEl = $(`<div class="dayData">Humidity: ${data.main.humidity}</div>`);
                        let uviEl = $(`<div class="inline uvi">${uvi}</div>`);
                        if (uvi <= 3) {
                            uviEl.css('background-color', 'green');
                        } else if (uvi <= 5) {
                            uviEl.css({
                                'background-color': 'yellow',
                                'color': 'black'
                            });
                        } else if (uvi <= 7) {
                            uviEl.css('background-color', 'orange');
                        } else if (uvi <= 8) {
                            uviEl.css('background-color', 'red');
                        } else if (uvi <= 11) {
                            uviEl.css('background-color', 'magenta');
                        }
                        dayForecast.append(tempEl).append(windEl).append(humidityEl).append('UV Index: ', uviEl);
                        makeHistoryButtons();
                    }
                    uvIndex();
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            let d = new Date;
                            let m = d.getMonth() + 1;
                            let day = d.getDate() + 1;
                            let y = d.getFullYear();
                            for (let i = 0; i < 5; i++) {
                                if (day >= 30) {
                                    m = m + 1;
                                    day = 1
                                }
                                let date = '(' + m + '/' + day++ + '/' + y + ')'
                                let icon = data.list[i].weather[0].icon;
                                let feelsLike = (data.list[i].main.feels_like - 273.15) * 1.8000 + 32.00;
                                let temp = (data.list[i].main.temp - 273.15) * 1.8000 + 32.00;
                                let img = $(`<div class="weeklyForecastDay"><h2>${date}</h2><img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"><p class="data">Temp: ${temp.toFixed(1)}°</p><p class="data">Feels like: ${feelsLike.toFixed(1)}°</p><p class="data">Wind: ${data.list[i].wind.speed} MPH</p><p class="data">Humidity: ${data.list[i].main.humidity}%</p></div>`);
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
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            let uvi;
            async function getIconPic() {
                await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        iconPic = data.list[0].weather[0].icon;
                        return iconPic
                    });
                let iconUrl = `http://openweathermap.org/img/wn/${iconPic}@2x.png`;
                let iconImg = $(`<img class="ico" src="${iconUrl}">`);
                day.text(city + ' ' + date).addClass('current');
                day.append(iconImg);

            }
            getIconPic();
            let temp = (((data.main.temp) + 9) / 5).toFixed(1);
            let wind = (data.wind.speed * 2.2).toFixed(1);
            async function uvIndex() {
                await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        uvi = data.current.uvi;
                        return uvi;
                    })
                let tempEl = $(`<div class="dayData">Temp: ${temp}°</div>`);
                let windEl = $(`<div class="dayData">Wind: ${wind} MPH</div>`);
                let humidityEl = $(`<div class="dayData">Humidity: ${data.main.humidity}</div>`);
                let uviEl = $(`<div class="inline uvi">${uvi}</div>`);
                if (uvi <= 3) {
                    uviEl.css('background-color', 'green');
                } else if (uvi <= 5) {
                    uviEl.css({
                        'background-color': 'yellow',
                        'color': 'black'
                    });
                } else if (uvi <= 7) {
                    uviEl.css('background-color', 'orange');
                } else if (uvi <= 8) {
                    uviEl.css('background-color', 'red');
                } else if (uvi <= 11) {
                    uviEl.css('background-color', 'magenta');
                }
                dayForecast.append(tempEl).append(windEl).append(humidityEl).append('UV Index: ', uviEl);
            }
            uvIndex();
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let d = new Date;
                    let m = d.getMonth() + 1;
                    if (m >= 13) {
                        m = 0;
                    }
                    let day = d.getDate() + 1;
                    let y = d.getFullYear();
                    for (let i = 0; i < 5; i++) {
                        if (day >= 30) {
                            m = m + 1;
                            day = 1
                        }
                        let date = '(' + m + '/' + day++ + '/' + y + ')'
                        let icon = data.list[i].weather[0].icon;
                        let feelsLike = (data.list[i].main.feels_like - 273.15) * 1.8000 + 32.00;
                        let temp = (data.list[i].main.temp - 273.15) * 1.8000 + 32.00;
                        let img = $(`<div class="weeklyForecastDay"><h2>${date}</h2><img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"><p class="data">Temp: ${temp.toFixed(1)}°</p><p class="data">Feels like: ${feelsLike.toFixed(1)}°</p><p class="data">Wind: ${data.list[i].wind.speed} MPH</p><p class="data">Humidity: ${data.list[i].main.humidity}%</p></div>`);
                        weekForecast.append(img);
                    }
                });
        });
}

form.submit(function(e) {
    e.preventDefault();
    weatherData();
});