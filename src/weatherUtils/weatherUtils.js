const apiKey = "cb1f260f2262d15dfcc2d8a0c40899c5";

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/forecast/"

function get5DaysEpochTime(currentEpochTime){
  //Returns 5 days epoch times of utc
  let epochTimes = [];
  epochTimes.push(currentEpochTime);
  let currentCounter = parseInt(epochTimes);
  let totalSecondsIn1Day = 24 * 60 * 60;
  for(let i=0; i<4; i++){
    currentCounter +=  totalSecondsIn1Day;
    epochTimes.push(currentCounter);
  }
  return epochTimes;
}

function weather5DaysData(weatherData) {
    let weatherListData =  weatherData['list'];
    let currentData = weatherListData[0]
    let currentEpochTime = currentData['dt'];
    let allEpochTimes = get5DaysEpochTime(currentEpochTime);

    let weather5DaysData = weatherListData.filter(wd=>{
      return allEpochTimes.includes(wd['dt'])
    })
    
    let filteredData = [];
    filteredData.push({
      "currentTemperature": weather5DaysData[0]['main']['temp']
    });
    weather5DaysData.forEach(wd=>{
      filteredData.push({temp_min: wd['main']['temp_min'], temp_max: wd['main']['temp_max'], weather: wd['weather'][0]['main'], weather_desc: wd['weather'][0]['description']}
      );
    }
    )
    return filteredData;

}
async function getWeatherData(city) {
  try {
      let weatherUrl = `${weatherBaseUrl}?q=${city}&units=metric&appid=${apiKey}`;
      let fetchRes = await fetch(weatherUrl);
      
      if (!fetchRes.ok) {
          throw new Error(`Failed to fetch weather data for ${city}`);
      }
      
      let jsonData = await fetchRes.json();
      
      return weather5DaysData(jsonData);
  } catch (error) {
      console.error("Error fetching weather data:", error.message);
      return []; // Return an empty array in case of errors
  }
}
export default getWeatherData;