const telegramBot = require('../src/telegramBot');

module.exports = async (req, res) => {
    try {
        await telegramBot.sendEarthquakeUpdates();
        res.status(200).json({ message: 'Earthquake check completed' });
    } catch (error) {
        console.error('Earthquake cron error:', error);
        res.status(500).json({ error: error.message });
    }
}; 