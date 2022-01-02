
const weatherForm = document.querySelector('.city-search-form')
const cityInput = document.querySelector('#city-search')
const clock = document.querySelector('.date-time')
const localClock = document.querySelector('.local-time')
let currentCity = localStorage.getItem('city') || 'Hanoi'
let currentLocalTimeZone = localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone

function showTime() {
  let date = new Date()
  var h = date.getHours() // 0 - 23
  var m = date.getMinutes() // 0 - 59
  var s = date.getSeconds() // 0 - 59

  if (m === 30) {
    fetchHourlyData()
  }

  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s

  let time = `${date.toLocaleString('en-US', {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})} ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
  let localTime = `${date.toLocaleString('en-US', {month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: `${currentLocalTimeZone}`,})}`
  // var time = h + ':' + m + ':' + s
  clock.innerText = time
  clock.textContent = time
  localClock.innerText = localTime

  setTimeout(showTime, 1000)
}

const returnTimeZoneName = async (offset) => {
  let result
  const data = await fetch('./timeZones.json').then(data => data.json())
  data.forEach(zone => {
    if (zone.offset === offset) {
      result = zone.utc[0]
    }
  })
  return result
}

showTime()

const fetchWeather = async (city) => {
  const url = `/api?q=${city}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.cod === '404') {
    alert('City not found!')
    cityInput.value = ''
    return
  }
  currentCity = city
  localStorage.setItem('city', city)
  localStorage.setItem('timezone', currentLocalTimeZone)
  showWeather(data)
  cityInput.value = ''
}


const showWeather = async (data) => {
  const city = document.querySelector('.city')
  const country = document.querySelector('.country')
  const timeOffset = document.querySelector('.time-offset')
  const thermometerIcon = document.querySelector('#thermometer')
  const celsius = document.querySelector('.celsius')
  const feelsLike = document.querySelector('.feels-like')
  const weatherDescription = document.querySelector('.description')
  const windIcon = document.querySelector('#wind-icon')
  const windSpeed = document.querySelector('.wind-speed')
  const windDirection = document.querySelector('.wind-direction')
  const humidity = document.querySelector('.humidity')
  const pressureIndicator = document.querySelector('.pressure-indicator')
  const dewPoint = document.querySelector('.dew-point')
  const visibility = document.querySelector('.visibility')

  const offset = data.timezone / 3600

  currentLocalTimeZone = await returnTimeZoneName(offset)
  const hour = Math.trunc(offset)
  const minute = offset % 1
  
  timeOffset.innerText = `GMT${offset >= 0 ? '+' : ''}${hour}:${minute*60}`
  const thermometerClassName = ['fa-thermometer-empty', 'fa-thermometer-quarter', 'fa-thermometer-half', 'fa-thermometer-three-quarters', 'fa-thermometer-full']
  let thermometerIndex = (Math.round(kelvinToCelsius(data.main.temp) /10) - 1)
  thermometerIndex = thermometerIndex < 0 ? 0 : thermometerIndex > 4 ? 4 : thermometerIndex 
  thermometerIcon.className = `fas ${thermometerClassName[thermometerIndex]}`
  windIcon.className = `wi wi-wind wi-from-${degToCompass(data.wind.deg).toLowerCase()}`

  city.innerText = data.name
  country.innerText = data.sys.country
  celsius.innerText = kelvinToCelsius(data.main.temp).toFixed(1)
  feelsLike.innerText = Math.round(kelvinToCelsius(data.main.feels_like))
  weatherDescription.innerText = data.weather[0].description
  windSpeed.innerText = data.wind.speed
  windDirection.innerText = degToCompass(data.wind.deg)
  pressureIndicator.innerText = data.main.pressure
  humidity.innerText = data.main.humidity
  dewPoint.innerText = calculateDewPoint(kelvinToCelsius(data.main.temp), data.main.humidity).toFixed(1)
  visibility.innerText = (data.visibility / 1000).toFixed(1)
}

const calculateDewPoint = (celsius, humi) => {
  const ans = (celsius - (14.55 + 0.114 * celsius) * (1 - (0.01 * humi)) - Math.pow(((2.5 + 0.007 * celsius) * (1 - (0.01 * humi))),3) - (15.9 + 0.117 * celsius) * Math.pow((1 - (0.01 * humi)), 14))
  return ans
}

const degToCompass = (deg) => {
  let val = Math.floor((deg/22.5) + 0.5)
  let arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return arr[(val % 16)]
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

fetchWeather(currentCity)
setInterval( ()=> {
  fetchWeather(currentCity)
}, 60000)
