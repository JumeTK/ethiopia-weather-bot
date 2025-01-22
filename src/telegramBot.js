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
                await this.bot.sendPhoto(
                    TELEGRAM_CHANNEL_ID,
                    message.photo,
                    {
                        caption: message.text,
                        parse_mode: 'Markdown'
                    }
                );
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
                const messages = await weatherService.formatFullUpdate(weatherData);
                for (const message of messages) {
                    await this.bot.sendPhoto(
                        TELEGRAM_CHANNEL_ID,
                        message.photo,
                        {
                            caption: message.text,
                            parse_mode: 'Markdown'
                        }
                    );
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        } catch (error) {
            console.error('Error sending weather updates:', error);
        }
    }
}

module.exports = new TelegramBotService(); 