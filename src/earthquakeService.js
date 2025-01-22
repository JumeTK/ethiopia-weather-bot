const axios = require('axios');
const { USGS_API_URL } = require('../config');

class EarthquakeService {
    async getEthiopiaEarthquakes() {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000); // Last 1 hour only

        try {
            const response = await axios.get(USGS_API_URL, {
                params: {
                    format: 'geojson',
                    starttime: oneHourAgo.toISOString(),
                    endtime: now.toISOString(),
                    latitude: 9.145,
                    longitude: 40.489,
                    maxradiuskm: 500,
                    minmagnitude: 2.5
                }
            });

            return response.data.features;
        } catch (error) {
            console.error('Error fetching earthquake data:', error);
            return [];
        }
    }

    formatMessage(earthquake) {
        const magnitude = earthquake.properties.mag;
        const place = earthquake.properties.place;
        const time = new Date(earthquake.properties.time).toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const depth = earthquake.geometry.coordinates[2];

        // Fun magnitude descriptions
        const magnitudeDesc = this.getMagnitudeDescription(magnitude);
        
        // Fun depth descriptions
        const depthDesc = this.getDepthDescription(depth);

        return `🚨 *Earthquake Alert in Ethiopia!* 🚨\n\n` +
            `*Magnitude:* ${magnitude} (${magnitudeDesc})\n` +
            `*Location:* ${place}\n` +
            `*Time:* ${time}\n` +
            `*Depth:* ${depth}km (${depthDesc})\n\n` +
            `Stay safe, Ethiopia! 🇪🇹\n\n` +
            `📅 *${time}*\n` +
            '🔔 Join us for real-time alerts: @YourUsername\n' +
            '📱 Contact: @YourUsername';
    }

    getMagnitudeDescription(magnitude) {
        if (magnitude < 3) return "Just a gentle Ethiopian massage 💆‍♂️";
        if (magnitude < 4) return "Injera plates rattling! 🍽";
        if (magnitude < 5) return "Coffee cups dancing! ☕";
        if (magnitude < 6) return "Time to do the Ethiopian shake! 💃";
        return "Whoa! Even the mountains are doing eskista! 🏔";
    }

    getDepthDescription(depth) {
        if (depth < 10) return "Shallow as a coffee saucer";
        if (depth < 30) return "Deep as a tej bet cellar";
        if (depth < 70) return "Deep as ancient Ethiopian history";
        return "Deeper than Lake Tana!";
    }
}

module.exports = new EarthquakeService(); 