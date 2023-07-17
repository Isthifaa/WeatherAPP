const time=document.getElementById('time');
const dateele=document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone=document.getElementById('time-zone');
const country=document.getElementById('country');
const weatherForecastele=document.getElementById('weather-forecast');
const currentTemp=document.getElementById('current-temp');

const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const API_KEY='7a5728d7c4f1470bb66ecdd5c2dfdcd3';

setInterval(()=>{
    const timeVal=new Date();
    const month=timeVal.getMonth();
    const dateVal=timeVal.getDate();
    const day=timeVal.getDay();
    const hour=timeVal.getHours();
    const hoursIn12HrFormat=hour>=13?hour%12:hour
    const minutes=timeVal.getMinutes();
    const ampm=hour>=12?'PM':'AM'
    time.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateele.innerHTML = days[day] + ', ' + dateVal+ ' ' + months[month]

}, 1000);

getWeatherData();
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{
        let{latitude,longitude}=success.coords;
        console.log(success);
        fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&exclude=minutely,hourly&include=daily`).then(res=>res.json()).then(data=>{
            console.log(data);
            showWeatherData(data);
        }
        )

    })
}

function showWeatherData(data){
    console.log(data.data[0]);
    console.log(data.data[0].temp);
    timezone.innerHTML=data.timezone;
    country.innerHTML=data.country_code;
    timezone.innerHTML = data.data[0].timezone;
    country.innerHTML = data.data[0].country_code;
    document.getElementById('wind-speed').innerHTML=`${data.data[0].wind_spd} m/s`;
    document.getElementById('wind-direction').innerHTML=`${data.data[0].wind_dir} &#176;`;
    document.getElementById('pressure').innerHTML=`${data.data[0].pres} mb`; 
    document.getElementById('city-name').innerHTML=`${data.data[0].city_name}`;
    console.log(data.data[0].wind_spd);

    
    let otherDayForcast = ''
    data.data[0].daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastele.innerHTML = otherDayForcast;
}