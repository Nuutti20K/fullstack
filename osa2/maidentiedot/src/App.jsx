import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

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

const Content = ({ countries, onShow }) => {
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
        <Country country={countries[0]} />
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

const Country = ({ country }) => {
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
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
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

  const handleShow = name => {
    setFilter(name)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Countries</h1>
      <Filter value={filter} onChange={handleFilterChange} />
      <Content countries={countriesToShow} onShow={handleShow} />
    </div>
  )

}

export default App