import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      find countries: <input value={value} onChange={onChange} />
    </div>
  )
}

const Content = ({ countries, onShow, onLoad, weather, icon }) => {
  if (countries.length > 10) {
    return (
      <div>
        <h2>Results</h2>
        Too many matches, specify another filter
      </div>
    )
  }

  if (countries.length === 1) {
    return (
      <div>
        <Country country={countries[0]} onLoad={onLoad} weather={weather} icon={icon}/>
      </div>
    )
  }

  return (
    <div>
      <h2>Results</h2>
      {countries.map(country => <li key={country.name.common}>
        {country.name.common}
        <button onClick={() => onShow(country.name.common)}>Show</button>
      </li>)}
    </div>
  )
}

const Country = ({ country, onLoad, weather, icon }) => {
  useEffect(() => {
    onLoad(country.capital)
  }, [country])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <li>Capital {country.capital}</li>
      <li>Area {country.area}</li>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(language => <li key={language[0]}>{language[1]}</li>)}
      </ul>
      <img src={country.flags.png} />
      <h2>Weather in {country.capital}</h2>
      {weather && <li>Temperature {weather.main.temp} Celsius</li>}
      {weather && <img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`} />}
      {weather && <li>Wind {weather.wind.speed} m/s</li>}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const [icon, setIcon] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        console.log(response.data.map(c => c.name.common))
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const getWeather = (name) => {
    axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${api_key}`)
      .then(response => {
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&units=metric&appid=${api_key}`)
          .then(response => {
            setWeather(response.data)
            console.log(response.data)
          })
        console.log(response.data[0])
      })
  }

  const handleShow = name => {
    setFilter(name)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))


  return (
    <div>
      <h1>Countries</h1>
      <Filter value={filter} onChange={handleFilterChange} />
      <Content countries={countriesToShow} onShow={handleShow} onLoad={getWeather} weather={weather} icon={icon}/>
    </div>
  )

}

export default App