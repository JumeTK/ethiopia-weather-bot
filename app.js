const express = require('express');
const telegramBot = require('./src/telegramBot');
const { PORT, TELEGRAM_CHANNEL_ID } = require('./config');
const earthquakeService = require('./src/earthquakeService');
const infoService = require('./src/infoService');
const imageService = require('./src/imageService');

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
            earthquake: ['/cron-earthquake', '/api/cron-earthquake'],
            facts: '/cron-facts'
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

// Add this new test endpoint
app.get('/test-earthquake', async (req, res) => {
    try {
        const earthquakes = await earthquakeService.getEthiopiaEarthquakes();
        res.json({
            count: earthquakes.length,
            earthquakes: earthquakes.map(quake => ({
                magnitude: quake.properties.mag,
                place: quake.properties.place,
                time: new Date(quake.properties.time).toLocaleString('en-ET'),
                coordinates: quake.geometry.coordinates
            }))
        });
    } catch (error) {
        console.error('Test earthquake error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Dedicated facts endpoint
app.get('/cron-facts', async (req, res) => {
    try {
        const currentHour = new Date().getHours();
        let message = '';
        let imageUrl = '';

        // Early Morning fact (6 AM)
        if (currentHour === 6) {
            const weatherFact = infoService.getRandomWeatherFact();
            message = `🌄 * ደህና አደሩ?! | Good Morning!*\n\n` +
                     `*Daily Weather Tip:*\n${weatherFact}\n\n` +
                     `ውድ ጊዜዎን በደህና ያሳልፉ! Have a great day ahead! 🌟`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }
        // Morning fact (9 AM)
        else if (currentHour === 9) {
            const weatherFact = infoService.getRandomWeatherFact();
            message = `🌅 *ጥሩ ጠዋት | Good Morning Ethiopia!*\n\n` +
                     `*Today's Weather Fact:*\n${weatherFact}\n\n` +
                     `በደስታ ይስሩ! Have a blessed day! ☕`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }
        // Late Morning fact (11 AM)
        else if (currentHour === 11) {
            const earthquakeFact = infoService.getRandomEarthquakeFact();
            message = `🌞 *ጥሩ ቀን | Good Day!*\n\n` +
                     `*Safety Reminder:*\n${earthquakeFact}\n\n` +
                     `ደህንነትዎን ይጠብቁ! Stay safe! 🛡️`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }
        // Afternoon fact (2 PM)
        else if (currentHour === 14) {
            const earthquakeFact = infoService.getRandomEarthquakeFact();
            message = `☀️ *እንደምን አረፈዱ?! | Good Afternoon!*\n\n` +
                     `*Safety Tip of the Day:*\n${earthquakeFact}\n\n` +
                     `ጤናዎን ይጠብቁ! Take care! 🙏`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }
        // Tea time fact (4 PM)
        else if (currentHour === 16) {
            const seasonalTip = infoService.getSeasonalAdvice();
            message = `🫖 *የሻይ ሰዓት | Tea Time Wisdom!*\n\n` +
                     `*Ethiopian Weather Wisdom:*\n${seasonalTip}\n\n` +
                     `ጣፋጭ ሻይ ይጠጡ! Enjoy your tea! 🍵`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }
        // Evening fact (7 PM)
        else if (currentHour === 19) {
            const weatherFact = infoService.getRandomWeatherFact();
            message = `🌆 *መልካም ምሽት | Good Evening!*\n\n` +
                     `*Evening Weather Note:*\n${weatherFact}\n\n` +
                     `ለነገ ይዘጋጁ! Prepare for tomorrow! 🌙`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }
        // Night fact (9 PM)
        else if (currentHour === 21) {
            const seasonalTip = infoService.getSeasonalAdvice();
            message = `🌙 *ደስ የሚል ሌሊት | Pleasant Night!*\n\n` +
                     `*Seasonal Update:*\n${seasonalTip}\n\n` +
                     `መልካም ሌሊት! Good night! ✨`;
            imageUrl = imageService.getTimeBasedImage(currentHour);
        }

        if (message) {
            await telegramBot.bot.sendPhoto(
                TELEGRAM_CHANNEL_ID,
                imageUrl,
                {
                    caption: message + '\n\n' +
                            '*📱 Stay Connected:*\n' +
                            '• *Channel:* @etweatheralert\n' +
                            '• *Contact:* @nastydeed',
                    parse_mode: 'Markdown'
                }
            );
            res.json({ status: 'Fact posted successfully' });
        } else {
            res.json({ status: 'No fact scheduled for this hour' });
        }
    } catch (error) {
        console.error('Fact posting error:', error);
        res.status(500).json({ error: error.message });
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