const telegramBot = require('./src/telegramBot');

// Immediately run the earthquake updates
(async () => {
    try {
        await telegramBot.sendEarthquakeUpdates();
        console.log('Earthquake check completed.');
    } catch (error) {
        console.error('Error during earthquake check:', error);
    }
})(); 