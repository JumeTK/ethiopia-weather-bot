const telegramBot = require('../src/telegramBot');

module.exports = async (req, res) => {
    try {
        await telegramBot.sendWeatherUpdates();
        res.status(200).json({ message: 'Weather update completed' });
    } catch (error) {
        console.error('Weather cron error:', error);
        res.status(500).json({ error: error.message });
    }
}; 