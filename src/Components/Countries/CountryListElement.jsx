const CountryListElement = ({country, onShowButtonClicked}) => {

    return(
        <li>{country.name.common}
            <button onClick={() => {onShowButtonClicked(country)}}>Show</button>
        </li> 
    )
}

export default CountryListElement