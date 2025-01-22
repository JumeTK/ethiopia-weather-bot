const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID } = require('../config');
const earthquakeService = require('./earthquakeService');
const weatherService = require('./weatherService');

class TelegramBotService {
    constructor() {
        this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
    }

    async sendEarthquakeUpdates() {
        try {
            const earthquakes = await earthquakeService.getEthiopiaEarthquakes();
            
            for (const quake of earthquakes) {
                const message = earthquakeService.formatMessage(quake);
                await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, message, {
                    parse_mode: 'Markdown'
                });
                
                // Add delay between messages to avoid hitting rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('Error sending earthquake updates:', error);
        }
    }

    async sendWeatherUpdates() {
        try {
            const weatherData = await weatherService.getWeatherUpdates();
            if (weatherData.length > 0) {
                const message = weatherService.formatFullUpdate(weatherData);
                await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, message, {
                    parse_mode: 'Markdown'
                });
            }
        } catch (error) {
            console.error('Error sending weather updates:', error);
        }
    }
}

module.exports = new TelegramBotService(); 