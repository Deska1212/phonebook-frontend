import { useEffect, useState } from 'react'
import axios from 'axios'
import CountryListElement from './Components/Countries/CountryListElement'

// Using a weather API, get a weather report for the capital of the selected country (If one)

const CountriesApp = () => {
    const baseCountryURL = 'https://studies.cs.helsinki.fi/restcountries/api'
    const baseWeatherURL = `https://api.openweathermap.org/data/3.0/onecall?`
    
    
    const api_key = import.meta.env.VITE_SOME_KEY
    console.log(api_key)

    const [countryFilter, setCountryFilter] = useState('')
    const [countries, setCountries] = useState([])
    const [weather, setWeather] = useState(null)

    // Runs on mount
    useEffect(() => {
        // Retrieve the initial state from the server
        axios.get(`${baseCountryURL}/all`).then((response) => {
            console.log(response)
            setCountries(response.data)
        })
    }, [])

    // Runs on countries changed
    useEffect(() => {
        console.log('use effect')
        setWeather(null)
        if(countriesFiltered.length === 1)
        {
            console.log('getting weather data...')
            const latitude = countriesFiltered[0].capitalInfo.latlng[0]
            const longditude = countriesFiltered[0].capitalInfo.latlng[1]

            axios.get(`${baseWeatherURL}${getWeatherURLSuffix(latitude, longditude)}`).then(res => {
                console.log(res.data);
                setWeather(res.data.current)
            })
        }
    }, [countryFilter])

    const handleOnCountryFilterChanged = (event) => {
        const value = event.target.value
        setCountryFilter(value)
    }

    const handleOnShowButtonClicked = (country) => 
    {
        setCountryFilter(country.name.common)
    }

    const getWeatherURLSuffix = (lat, lon) => {
        return `lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
    }

    const normalizedFilter = countryFilter.trim().toLowerCase()
    const countriesFiltered  = normalizedFilter === '' ? [] : countries.filter(country => country.name.common.toLowerCase().includes(normalizedFilter))

    console.log(`${normalizedFilter} found countries ${countriesFiltered.length}`)

    return(
        <div>
            
            Find Countries: <input value={countryFilter} onChange={handleOnCountryFilterChanged}/>
            
            {
                // Too many entries
                countriesFiltered.length > 10 && <div>Too many matches, please make search more specific</div>
            }

            {
                // Less than 10 but not 1
                countriesFiltered.length <= 10 && countriesFiltered.length > 1 && (
                    <ul>
                        {countriesFiltered.map(c => <CountryListElement key={c.cca2} country={c} onShowButtonClicked={handleOnShowButtonClicked}></CountryListElement>)}
                    </ul>
                )
            }

            {
                // If we only have one country display the following
                // Name as header, capital, Area, languages and flag
                
                    countriesFiltered.length === 1 && (() => {
                    const country = countriesFiltered[0]
                    const languages = Object.values(country.languages)

                    

                    return (
                        <div>
                            <h1>{country.name.common}</h1>
                            <p>Capital: {country.capital[0]}</p>
                            <p>Area: {country.area} metres squared</p>

                            <h2>Languages</h2>
                            <ul>
                                {
                                    
                                    languages.map(lang => <li key={lang}>{lang}</li>)
                                }
                            </ul>

                            {country.flags?.svg && (
                                <img src={country.flags.svg} alt={`${country.name.common} flag`} style={{width: 250}}/>
                            )}

                            <h2>Weather in {country.capital}</h2>
                            <p>{weather ? <>Temperature: {weather.temp} C</> : <>Loading weather...</>}</p>
                            <p>{weather ? <>Wind: {weather.wind_speed} m.s</> : <>Loading wind speed...</>}</p>
                            
                                {weather ? weather.weather.map(w => <img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}/>) : <></>}

                        </div>
                    )   
                })()
            }
        </div>
    )
}

export default CountriesApp