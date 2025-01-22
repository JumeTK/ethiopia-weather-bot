const express = require('express');
const telegramBot = require('./src/telegramBot');
const { PORT, TELEGRAM_CHANNEL_ID } = require('./config');

const app = express();

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Ethiopia Weather & Earthquake Bot API',
        endpoints: {
            health: '/health',
            test: '/test-bot',
            weather: ['/cron-weather', '/api/cron-weather'],
            earthquake: ['/cron-earthquake', '/api/cron-earthquake']
        }
    });
});

// Weather endpoints (support both paths)
app.get(['/cron-weather', '/api/cron-weather'], async (req, res) => {
    try {
        console.log('Weather update triggered');
        await telegramBot.sendWeatherUpdates();
        res.status(200).json({ message: 'Weather update completed' });
    } catch (error) {
        console.error('Weather cron error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Earthquake endpoints (support both paths)
app.get(['/cron-earthquake', '/api/cron-earthquake'], async (req, res) => {
    try {
        console.log('Earthquake check triggered');
        await telegramBot.sendEarthquakeUpdates();
        res.status(200).json({ message: 'Earthquake check completed' });
    } catch (error) {
        console.error('Earthquake cron error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Test endpoint to check bot connectivity
app.get('/test-bot', async (req, res) => {
    try {
        await telegramBot.bot.sendMessage(
            TELEGRAM_CHANNEL_ID, 
            "🔔 Bot test message - Ethiopia Weather & Earthquake Bot is online! 🇪🇹"
        );
        res.json({ status: 'Message sent successfully' });
    } catch (error) {
        console.error('Test message error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// Vercel serverless handler
if (process.env.VERCEL) {
    module.exports = app;
} else {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} 