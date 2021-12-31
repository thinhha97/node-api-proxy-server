const weatherDisplay = document.querySelector('.weather')
const weatherForm = document.querySelector('.weather-form')
const cityInput = document.querySelector('#city-input')

const fetchWeather = async (city) => {
  const url = `/api?q=${city}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.cod === '404') {
    alert('City not found!')
    cityInput.value = ''
    return
  }

  const displayData = {
    city: data.name,
    temp: data.main.temp,
    like: data.main.feels_like,
    humid: data.main.humidity,
    country: data.sys.country,
    desc: data.weather[0].description
  }
  addWeatherToDOM(displayData)
}

const addWeatherToDOM = (data) => {
  document.title = `${data.city}'s weather.`
  weatherDisplay.innerHTML = `
  <h2>Weather in <span style="font-size: 2rem;"> ${data.city}, ${data.country}</span></h2>
  <h2>${data.desc}</h2>
  <h1>${data.temp}&deg;K | ${kelvinToFahrenheit(
    data.temp
  )}&deg;F | ${Math.round(kelvinToCelsius(data.temp), 5)}&deg;C</h1>
  <h2>Feel like: ${kelvinToFahrenheit(
    data.like
  )}&deg;F | ${Math.round(kelvinToCelsius(data.like), 5)}&deg;C</h2>

  <h2>Humidity: ${data.humid}&#37;</h2>
  `
  cityInput.value = ''
}

const kelvinToFahrenheit = (k) => {
  return Math.ceil(((k - 273.15) * 9) / 5 + 32)
}

const kelvinToCelsius = (k) => {
  return k - 273.15
}

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (cityInput.value === '') {
    alert('Please enter a city')
    return
  } else {
    fetchWeather(cityInput.value)
  }
})

fetchWeather('Hanoi')
