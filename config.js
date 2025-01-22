require('dotenv').config();

module.exports = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
    USGS_API_URL: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: process.env.PORT || 3000
}; 