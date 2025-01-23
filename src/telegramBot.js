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
            // Check for new earthquakes
            const earthquakes = await earthquakeService.getEthiopiaEarthquakes();
            
            for (const quake of earthquakes) {
                if (earthquakeService.shouldSendAlert(quake)) {
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
            }

            // Send summaries at 9 AM and 9 PM
            const currentHour = new Date().getHours();
            if (currentHour === 9 || currentHour === 21) {
                const summary = await earthquakeService.get12HourSummary();
                const summaryMessage = earthquakeService.formatSummaryMessage(summary);
                await this.bot.sendPhoto(
                    TELEGRAM_CHANNEL_ID,
                    summaryMessage.photo,
                    {
                        caption: summaryMessage.text,
                        parse_mode: 'Markdown'
                    }
                );
            }
        } catch (error) {
            console.error('Error sending earthquake updates:', error);
        }
    }

    async sendWeatherUpdates() {
        try {
            const weatherData = await weatherService.getWeatherUpdates();
            if (weatherData.length > 0) {
                const message = await weatherService.formatFullUpdate(weatherData);
                await this.bot.sendMessage(
                    TELEGRAM_CHANNEL_ID,
                    message,
                    { parse_mode: 'Markdown' }
                );
            }
        } catch (error) {
            console.error('Error sending weather updates:', error);
        }
    }
}

module.exports = new TelegramBotService(); 