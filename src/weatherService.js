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
                wind_speed: response.data.wind.speed,
                weather_icon: response.data.weather[0].icon
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

        // Get weather icon URL
        const iconCode = weatherData.weather_icon || '01d';
        const weatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        return {
            text: `*${weatherData.city}* ${emoji}\n\n` +
                `• *Temperature:* ${Math.round(weatherData.temp)}°C\n` +
                `• *Feels like:* ${Math.round(weatherData.feels_like)}°C\n` +
                `• *Weather:* ${weatherData.description}\n` +
                `• *Humidity:* ${weatherData.humidity}%\n` +
                `• *Wind:* ${weatherData.wind_speed} m/s\n\n` +
                `*🌟 Friendly Advice:* ${randomAdvice}\n`,
            photo: weatherIconUrl
        };
    }

    async formatFullUpdate(weatherDataList) {
        const timestamp = new Date().toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        let messages = [];
        for (const data of weatherDataList) {
            const formattedData = this.formatWeatherMessage(data);
            messages.push({
                text: `🌍 *ETHIOPIAN WEATHER UPDATE* 🇪🇹\n\n${formattedData.text}\n` +
                    `*📱 Stay Connected:*\n` +
                    `• *Join Channel:* @etweatheralert\n` +
                    `• *Contact:* @nastydeed\n\n` +
                    `⏰ *Updated:* ${timestamp}`,
                photo: formattedData.photo
            });
        }

        return messages;
    }
}

module.exports = new WeatherService(); 