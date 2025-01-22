const axios = require('axios');
const { WEATHER_API_KEY } = require('../config');
const infoService = require('./infoService');

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

        // Get weather-specific nature image
        const weatherImage = this.getWeatherImage(weatherData.weather, weatherData.temp);

        return {
            text: `*${weatherData.city}* ${emoji}\n\n` +
                `• *Temperature:* ${Math.round(weatherData.temp)}°C\n` +
                `• *Feels like:* ${Math.round(weatherData.feels_like)}°C\n` +
                `• *Weather:* ${weatherData.description}\n` +
                `• *Humidity:* ${weatherData.humidity}%\n` +
                `• *Wind:* ${weatherData.wind_speed} m/s\n\n` +
                `*🌟 Friendly Advice:* ${randomAdvice}\n`,
            photo: weatherImage
        };
    }

    getWeatherImage(weather, temp) {
        const weatherImages = {
            Clear: [
                // Sunny Ethiopian landscapes
                'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8', // Simien Mountains
                'https://images.unsplash.com/photo-1515431940021-f59805522576', // Ethiopian Highlands
                'https://images.unsplash.com/photo-1589308454676-22c527126c88', // Danakil Desert
                'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23'  // Blue Nile Falls (sunny)
            ],
            Clouds: [
                // Cloudy Ethiopian scenes
                'https://images.unsplash.com/photo-1525824236856-9c0918e7ac91', // Cloudy Mountains
                'https://images.unsplash.com/photo-1520785815200-4f4c88f7c81d', // Misty Valley
                'https://images.unsplash.com/photo-1574788901656-6a9ee34a3fa7', // Foggy Forest
                'https://images.unsplash.com/photo-1612456225451-bb8d10d0131d'  // Cloudy Highlands
            ],
            Rain: [
                // Rainy Ethiopian landscapes
                'https://images.unsplash.com/photo-1519692933481-e162a57d6721', // Green Valley
                'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75', // Tropical Rain
                'https://images.unsplash.com/photo-1583245117317-5f677a816f0c', // Rainy Forest
                'https://images.unsplash.com/photo-1515518554912-63b4da53597d'  // Wet Season
            ],
            Thunderstorm: [
                // Dramatic storm scenes
                'https://images.unsplash.com/photo-1594156596782-656c93e4d504', // Lightning
                'https://images.unsplash.com/photo-1527572232473-494f1e9c7917', // Storm Clouds
                'https://images.unsplash.com/photo-1587135991058-8816b028691f', // Thunder
                'https://images.unsplash.com/photo-1581625392889-78e4e9c3a277'  // Dramatic Sky
            ],
            Drizzle: [
                // Light rain scenes
                'https://images.unsplash.com/photo-1541919329513-35f7af297129', // Misty Rain
                'https://images.unsplash.com/photo-1573075175751-c379b0f79afe', // Light Shower
                'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0', // Drizzle
                'https://images.unsplash.com/photo-1518873247959-c0c01f21c4a5'  // Gentle Rain
            ],
            Mist: [
                // Misty Ethiopian landscapes
                'https://images.unsplash.com/photo-1587135991058-8816b028691f', // Foggy Valley
                'https://images.unsplash.com/photo-1513436539083-9d2127e742f1', // Morning Mist
                'https://images.unsplash.com/photo-1511884642898-4c92249e20b6', // Misty Mountains
                'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5'  // Hazy Morning
            ]
        };

        // Get images for the current weather
        const images = weatherImages[weather] || weatherImages.Clear;
        return images[Math.floor(Math.random() * images.length)];
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
                    `${randomFact}\n\n` +
                    `⏰ *Updated:* ${timestamp}`,
                photo: formattedData.photo
            });
        }

        return messages;
    }
}

module.exports = new WeatherService(); 