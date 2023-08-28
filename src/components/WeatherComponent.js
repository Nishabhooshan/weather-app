import React, { useState } from 'react'
import '../App.css'
import moment from 'moment';
import getWeatherData from '../weatherUtils/weatherUtils';

function getImageUrl(weatherType){
  if(weatherType === "Rain" || weatherType === "Drizzle"){
    return `${process.env.PUBLIC_URL}/assets/small-weather-logos/rain.gif`;
  }
  else if(weatherType === "Cloud"){
    return `${process.env.PUBLIC_URL}/assets/small-weather-logos/clouds.gif`;
  }
  else if(weatherType === "Snow"){
    return `${process.env.PUBLIC_URL}/assets/small-weather-logos/snow.gif`;
  }
  else if(weatherType === "Thunderstorm"){
    return `${process.env.PUBLIC_URL}/assets/small-weather-logos/thunderstorm.gif`;
  }
  else{
    return `${process.env.PUBLIC_URL}/assets/small-weather-logos/clear.gif`;
  }
}

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [currentTemperature, setCurrentTemperature] = useState('');
  const handleCall = async () => {
    let currentValue = document.getElementById('cityId').value;
    
    const newData = await getWeatherData(currentValue);
    console.log(JSON.stringify(newData));
    setWeatherData(newData);
    document.getElementById('cityId').value = '';
    setCurrentTemperature(newData.length>0?newData[0]['currentTemperature']:"");
    setCity(newData.length>0?currentValue:"Enter valid city name" );
  }
  const handleKeyEnter = e => {
    // e.preventDefault();
    if (e.key === "Enter") {
      handleCall();
    }
  }
  let city_color = "white";
  let dynamicClassName = 'app-bg';
  if (weatherData.length > 0){
    let weatherCondition = weatherData[0]['weather']
    if (currentTemperature < 18) {
        dynamicClassName = 'app-bg winter';
        city_color = "black"
      }
      if (weatherCondition === "Rain"|| weatherCondition === "Drizzle"|| weatherCondition === "Thunderstorm") {
        dynamicClassName = 'app-bg rainy';
      }
    
  }

  return (
    <div className={dynamicClassName}>

      <div className='search-box'>
        <input id='cityId' type="search" placeholder='Enter your city name' onKeyDown={handleKeyEnter} />
        
      
      <div className='search-button'>
      <button onClick={handleCall}>Search</button>
      </div>
      </div>
      <div className='city-name' style={{color: city_color}}>
        {city}
      </div>
      <div className='weather-card'>
        <div>{currentTemperature === ""? "": currentTemperature+"°C"}</div>
      <p>Today</p>
      </div>
      <div className='weather-card-container'>
  {
    weatherData.map(function (temp, idx) {
        if (idx !== 0) {
            return (
                <div className='weather-small-card' key={idx}>
                <img src={getImageUrl(temp['weather'])} alt={temp['weather']} />
                <p>{idx===0 ? "Today": moment().add(idx, 'days').format('dddd')}</p>
                <p>Max: {temp['temp_max']}°C</p>
                <p>Min: {temp['temp_min']}°C</p>
                </div>
            )
        }
        else {
            return null;
        }
    })
  }
</div>
    </div>
  )
}

export default WeatherComponent