const express = require('express');
const telegramBot = require('./src/telegramBot');
const { PORT, TELEGRAM_CHANNEL_ID } = require('./config');

const app = express();

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