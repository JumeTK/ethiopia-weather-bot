const axios = require('axios');
const { USGS_API_URL } = require('../config');
const infoService = require('./infoService');

class EarthquakeService {
    constructor() {
        this.lastCheckedQuakes = new Set();
        this.lastCheckTime = new Date();
    }

    async getEthiopiaEarthquakes() {
        const now = new Date();
        // Look back just 6 minutes to catch any new events
        // (USGS typically takes 3-5 minutes to process and publish)
        const sixMinutesAgo = new Date(now.getTime() - 6 * 60 * 1000);

        try {
            const response = await axios.get(USGS_API_URL, {
                params: {
                    format: 'geojson',
                    starttime: sixMinutesAgo.toISOString(),
                    endtime: now.toISOString(),
                    latitude: 9.145,
                    longitude: 40.489,
                    maxradiuskm: 800,
                    minmagnitude: 2.0,
                    orderby: 'time' // Get newest first
                }
            });

            // Filter out already reported earthquakes
            const newQuakes = response.data.features.filter(quake => {
                const quakeTime = new Date(quake.properties.time);
                return !this.lastCheckedQuakes.has(quake.id) && 
                       quakeTime > this.lastCheckTime;
            });

            // Update last check time
            this.lastCheckTime = now;

            // Add new quakes to the set
            newQuakes.forEach(quake => this.lastCheckedQuakes.add(quake.id));

            // Keep set size manageable
            if (this.lastCheckedQuakes.size > 1000) {
                const oldestQuakes = Array.from(this.lastCheckedQuakes).slice(0, 500);
                oldestQuakes.forEach(id => this.lastCheckedQuakes.delete(id));
            }

            // Sort by time to ensure newest are processed first
            return newQuakes.sort((a, b) => b.properties.time - a.properties.time);
        } catch (error) {
            console.error('Error fetching earthquake data:', error);
            return [];
        }
    }

    async get12HourSummary() {
        const now = new Date();
        const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

        try {
            const response = await axios.get(USGS_API_URL, {
                params: {
                    format: 'geojson',
                    starttime: twelveHoursAgo.toISOString(),
                    endtime: now.toISOString(),
                    latitude: 9.145,
                    longitude: 40.489,
                    maxradiuskm: 800,
                    minmagnitude: 2.0
                }
            });

            return response.data.features;
        } catch (error) {
            console.error('Error fetching 12-hour summary:', error);
            return [];
        }
    }

    async get24HourSummary() {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        try {
            const response = await axios.get(USGS_API_URL, {
                params: {
                    format: 'geojson',
                    starttime: last24Hours.toISOString(),
                    endtime: now.toISOString(),
                    latitude: 9.145,
                    longitude: 40.489,
                    maxradiuskm: 800,
                    minmagnitude: 2.0
                }
            });

            return response.data.features;
        } catch (error) {
            console.error('Error fetching 24-hour summary:', error);
            return [];
        }
    }

    formatSummaryMessage(earthquakes) {
        if (earthquakes.length === 0) {
            return {
                text: `📊 *የ24 ሰዓት የመሬት መንቀጥቀጥ ማጠቃለያ | 24-HOUR EARTHQUAKE SUMMARY*\n\n` +
                      `*ተመስገን!! No earthquakes reported in the last 24 hours.* 🙏\n\n` +
                      `Stay prepared and stay safe! 🛡️`,
                photo: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8'
            };
        }

        // Sort by magnitude
        const sortedQuakes = [...earthquakes].sort((a, b) => b.properties.mag - a.properties.mag);
        
        let summary = `📊 *የ24 ሰዓት የመሬት መንቀጥቀጥ ማጠቃለያ | 24-HOUR EARTHQUAKE SUMMARY*\n\n`;
        summary += `*Total Events:* ${earthquakes.length}\n`;
        summary += `*Strongest:* M${sortedQuakes[0].properties.mag.toFixed(1)}\n`;
        summary += `*Most Recent:* ${new Date(sortedQuakes[0].properties.time).toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}\n\n`;

        summary += `*Detailed Events:*\n`;
        sortedQuakes.slice(0, 5).forEach((quake, index) => {
            summary += `${index + 1}. M${quake.properties.mag.toFixed(1)} - ${quake.properties.place}\n`;
        });

        if (sortedQuakes.length > 5) {
            summary += `...and ${sortedQuakes.length - 5} more events\n`;
        }

        const randomFact = infoService.getRandomEarthquakeFact();
        summary += `\n${randomFact}\n\n`;
        summary += `*📱 Stay Connected:*\n`;
        summary += `• *Channel:* @etweatheralert\n`;
        summary += `• *Contact:* @nastydeed`;

        // Use a static summary image instead of a map
        const summaryImage = earthquakes.length > 3 
            ? 'https://images.unsplash.com/photo-1594156596782-656c93e4d504'  // More activity
            : 'https://images.unsplash.com/photo-1581625392889-78e4e9c3a277'; // Less activity

        return {
            text: summary,
            photo: summaryImage
        };
    }

    formatMessage(earthquake) {
        const magnitude = earthquake.properties.mag;
        const place = earthquake.properties.place;
        const time = new Date(earthquake.properties.time).toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const depth = earthquake.geometry.coordinates[2];

        const magnitudeDesc = this.getMagnitudeDescription(magnitude);
        const depthDesc = this.getDepthDescription(depth);

        // Static earthquake images based on magnitude and depth
        const earthquakeImages = {
            severe: [
                'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg',
                'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg'
            ],
            moderate: [
                'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg',
                'https://images.pexels.com/photos/2480807/pexels-photo-2480807.jpeg'
            ],
            light: [
                'https://images.pexels.com/photos/2227774/pexels-photo-2227774.jpeg',
                'https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg'
            ]
        };

        // Select image based on magnitude
        let selectedImage;
        if (magnitude >= 4.0) {
            selectedImage = earthquakeImages.severe[Math.floor(Math.random() * earthquakeImages.severe.length)];
        } else if (magnitude >= 3.0) {
            selectedImage = earthquakeImages.moderate[Math.floor(Math.random() * earthquakeImages.moderate.length)];
        } else {
            selectedImage = earthquakeImages.light[Math.floor(Math.random() * earthquakeImages.light.length)];
        }

        // Get intensity note based on magnitude
        let intensityNote = '';
        if (magnitude < 2.5) {
            intensityNote = '\n*ማሳሰቢያ | Note:* መደበኛ ክትትል ብቻ ያስፈልጋል። Regular monitoring only, no immediate action needed. 📝';
        } else if (magnitude < 3.5) {
            intensityNote = '\n*ማሳሰቢያ | Note:* ንቁ ሁኑ እና መረጃዎችን ይከታተሉ። Stay alert and monitor updates. ⚠️';
        } else if (magnitude < 4.5) {
            intensityNote = '\n*አስፈላጊ ማሳሰቢያ | Important:* ወደ ደህንነት ቦታ ይሂዱ። Move to safe areas and follow safety guidelines! 🚸';
        } else {
            intensityNote = '\n*አስቸኳይ ማሳሰቢያ | URGENT:* የአደጋ ጊዜ ፕሮቶኮሎችን ይከተሉ! Follow emergency procedures immediately! 🚨';
        }

        const randomFact = infoService.getRandomEarthquakeFact();

        return {
            text: `🚨 *የመሬት መንቀጥቀጥ ማሳወቂያ | EARTHQUAKE ALERT!* 🚨\n\n` +
                `• *መጠን | Magnitude:* ${magnitude} (${magnitudeDesc})\n` +
                `• *ቦታ | Location:* ${place}\n` +
                `• *ሰዓት | Time:* ${time}\n` +
                `• *ጥልቀት | Depth:* ${depth}km (${depthDesc})\n\n` +
                `*🛡️ ተጠንቀቁ! | STAY SAFE, ETHIOPIA!* 🇪🇹\n` +
                `${intensityNote}\n\n` +
                `📱 *ለተጨማሪ መረጃ | For more information:*\n` +
                `• *Join us:* @etweatheralert\n` +
                `• *Contact:* @nastydeed\n\n` +
                `${randomFact}`,
            photo: selectedImage
        };
    }

    getMagnitudeDescription(magnitude) {
        if (magnitude < 2.5) return "ቀላል መንቀጥቀጥ | Very minor tremor - Most won't notice 🤫";
        if (magnitude < 3.0) return "ትንሽ መንቀጥቀጥ | Gentle shaking - Some might feel it 👀";
        if (magnitude < 3.5) return "መካከለኛ መንቀጥቀጥ | Light shaking - Indoor objects might move 🪑";
        if (magnitude < 4.0) return "ጠንካራ መንቀጥቀጥ | Noticeable shaking - Most will feel it 💫";
        if (magnitude < 4.5) return "በጣም ጠንካራ | Strong enough to wake you up! ⚡";
        if (magnitude < 5.0) return "አስጊ መንቀጥቀጥ | Significant - Take precautions! ⚠️";
        if (magnitude < 5.5) return "አደገኛ መንቀጥቀጥ | Very strong - Follow safety procedures! 🚨";
        return "እጅግ አደገኛ | Extremely strong - Seek safety immediately! 🏃‍♂️";
    }

    getDepthDescription(depth) {
        if (depth < 10) return "Shallow as a coffee saucer";
        if (depth < 30) return "Deep as a tej bet cellar";
        if (depth < 70) return "Deep as ancient Ethiopian history";
        return "Deeper than Lake Tana!";
    }

    shouldSendAlert(earthquake) {
        // Send immediate alerts for:
        // 1. Any earthquake above magnitude 2.0 (changed from 3.5)
        // 2. Any earthquake within 100km of a major city
        // 3. Any earthquake shallower than 10km
        const magnitude = earthquake.properties.mag;
        const depth = earthquake.geometry.coordinates[2];
        const [lon, lat] = earthquake.geometry.coordinates;

        // Major cities coordinates (expanded list)
        const majorCities = [
            { name: 'Addis Ababa', lat: 9.0320, lon: 38.7421 },
            { name: 'Dire Dawa', lat: 9.5931, lon: 41.8661 },
            { name: 'Mekelle', lat: 13.4967, lon: 39.4767 },
            { name: 'Bahir Dar', lat: 11.5742, lon: 37.3614 },
            { name: 'Hawassa', lat: 7.0504, lon: 38.4955 },
            { name: 'Adama', lat: 8.5400, lon: 39.2700 },
            { name: 'Gondar', lat: 12.6030, lon: 37.4521 },
            { name: 'Jimma', lat: 7.6667, lon: 36.8333 }
        ];

        // Check if near any major city
        const isNearCity = majorCities.some(city => {
            const distance = this.calculateDistance(lat, lon, city.lat, city.lon);
            return distance <= 100; // Within 100km
        });

        // Modified to always alert for magnitude >= 2.0
        return magnitude >= 2.0 || isNearCity || depth <= 10;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

module.exports = new EarthquakeService(); 