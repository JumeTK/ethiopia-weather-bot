const axios = require('axios');
const { WEATHER_API_KEY } = require('../config');

class WeatherService {
    // Major Ethiopian cities/regions
    cities = [
        { name: 'Addis Ababa', lat: 9.0320, lon: 38.7421 },
        { name: 'Dire Dawa', lat: 9.5931, lon: 41.8661 },
        { name: 'Bahir Dar', lat: 11.5742, lon: 37.3614 },
        { name: 'Mekelle', lat: 13.4967, lon: 39.4767 },
        { name: 'Hawassa', lat: 7.0504, lon: 38.4955 },
        { name: 'Adama', lat: 8.5400, lon: 39.2700 }
    ];

    async getWeatherUpdates() {
        const weatherPromises = this.cities.map(city => this.getCityWeather(city));
        const weatherData = await Promise.all(weatherPromises);
        return weatherData.filter(data => data !== null);
    }

    async getCityWeather(city) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    lat: city.lat,
                    lon: city.lon,
                    appid: WEATHER_API_KEY,
                    units: 'metric'
                }
            });

            return {
                city: city.name,
                temp: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                humidity: response.data.main.humidity,
                weather: response.data.weather[0].main,
                description: response.data.weather[0].description,
                wind_speed: response.data.wind.speed
            };
        } catch (error) {
            console.error(`Error fetching weather for ${city.name}:`, error);
            return null;
        }
    }

    getWeatherEmoji(weather) {
        const emojiMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Haze': '😶‍🌫️',
            'Dust': '💨',
            'Fog': '🌫️'
        };
        return emojiMap[weather] || '🌡️';
    }

    getHumorousAdvice(weather, temp) {
        if (weather === 'Rain') {
            return [
                "Time to protect your injera from getting wet! 🌯",
                "Perfect weather for a hot macchiato ☕",
                "Grab your umbrella or rock that traditional gabi as a raincoat! 🌂"
            ];
        } else if (weather === 'Clear' && temp > 25) {
            return [
                "Hot enough to cook shiro on the sidewalk! 🔥",
                "Even the camels are looking for shade today 🐪",
                "Time for a cold St. George beer! 🍺"
            ];
        } else if (weather === 'Clouds') {
            return [
                "Cloudy with a chance of tej! 🍯",
                "Perfect weather for a coffee ceremony ☕",
                "Neither hot nor cold - like perfectly made shiro! 🥘"
            ];
        }
        return ["Whatever the weather, it's always coffee time in Ethiopia! ☕"];
    }

    formatWeatherMessage(weatherData) {
        const emoji = this.getWeatherEmoji(weatherData.weather);
        const advice = this.getHumorousAdvice(weatherData.weather, weatherData.temp);
        const randomAdvice = advice[Math.floor(Math.random() * advice.length)];

        return `*${weatherData.city}* ${emoji}\n` +
            `Temperature: ${Math.round(weatherData.temp)}°C (Feels like ${Math.round(weatherData.feels_like)}°C)\n` +
            `Weather: ${weatherData.description}\n` +
            `Humidity: ${weatherData.humidity}%\n` +
            `Wind: ${weatherData.wind_speed} m/s\n\n` +
            `*Friendly Advice:* ${randomAdvice}\n`;
    }

    formatFullUpdate(weatherDataList) {
        const timestamp = new Date().toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        let message = `🌍 *Ethiopian Weather Update* 🇪🇹\n` +
            `${timestamp}\n\n`;

        weatherDataList.forEach(data => {
            message += this.formatWeatherMessage(data) + '\n';
        });

        message += '\n_Stay blessed like Ethiopian coffee!_ ☕\n\n' +
            `📅 *${timestamp}*\n` +
            '🔔 Join us for daily updates: @YourUsername\n' +
            '📱 Contact: @YourUsername';

        return message;
    }
}

module.exports = new WeatherService(); 