class InfoService {
    getRandomWeatherFact() {
        const facts = [
            "☔️ *Did you know?*\nEthiopia's rainy season (Kiremt) typically occurs between June and September.",
            
            "🌍 *Climate Fact:*\nAddis Ababa's elevation of 2,355m gives it one of Africa's most pleasant year-round climates!",
            
            "🌱 *Agriculture Tip:*\nThe Ethiopian highlands receive 80% of the country's total rainfall.",
            
            "☀️ *Fun Fact:*\nEthiopia is known as the 'Land of 13 Months of Sunshine' due to its unique calendar!",
            
            "🌧️ *Weather History:*\nThe Blue Nile Falls (Tis Abay) is most spectacular during the rainy season.",
            
            "🌪️ *Safety Tip:*\nDuring strong winds, avoid areas with loose structures or construction materials.",
            
            "🏔️ *Geographic Fact:*\nThe Simien Mountains influence local weather patterns and create unique microclimates.",
            
            "🌡️ *Health Tip:*\nDuring hot days, traditional Ethiopian cotton clothes provide natural cooling.",
            
            "⛈️ *Local Wisdom:*\nTraditional Ethiopian farmers can predict rain by observing cattle behavior!",
            
            "🌺 *Nature Note:*\nThe best time to visit Ethiopia's wildflower meadows is after the small rainy season (Belg)."
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }

    getRandomEarthquakeFact() {
        const facts = [
            "🏗️ *Safety Tip:*\nDuring an earthquake, the Ethiopian proverb says: 'ቆመህ ከመውደቅ ተቀምጠህ ውደቅ' (Better to sit and fall than stand and fall).",
            
            "🌍 *Geology Fact:*\nEthiopia's location in the East African Rift System makes it seismically active.",
            
            "📱 *Emergency Tip:*\nSave emergency contacts: Police (991), Ambulance (907), Fire (939).",
            
            "🏠 *Home Safety:*\nSecure heavy furniture and objects to walls to prevent falling during earthquakes.",
            
            "🚰 *Preparation Tip:*\nKeep emergency water supplies - 4 liters per person per day is recommended.",
            
            "🔦 *Emergency Kit:*\nInclude flashlights, batteries, and a battery-powered radio in your emergency kit.",
            
            "🏃‍♀️ *Safety Route:*\nIdentify safe spots in each room - under sturdy tables or against interior walls.",
            
            "🌋 *Geographic Fact:*\nThe Danakil Depression is one of Earth's most tectonically active areas!",
            
            "🏛️ *Historical Fact:*\nAncient Ethiopian churches were built to withstand earthquakes using flexible foundations.",
            
            "🧭 *Local Knowledge:*\nTraditional Ethiopian buildings use flexible materials that better resist earthquake damage."
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }

    getSeasonalAdvice() {
        const month = new Date().getMonth();
        const seasonalAdvice = {
            // Bega (dry season)
            0: "☀️ *Bega Season Tip:*\nProtect your skin from the dry weather with traditional Ethiopian butter!",
            1: "🌞 *Bega Update:*\nPerfect weather for outdoor coffee ceremonies!",
            2: "🌱 *Seasonal Note:*\nWatch for early Belg rains this month.",
            
            // Belg (short rains)
            3: "🌧️ *Belg Season:*\nLight rains are good for teff planting!",
            4: "🌺 *Spring Alert:*\nBest time to visit Ethiopia's flower valleys!",
            5: "☔️ *Weather Shift:*\nPrepare for transition to Kiremt season.",
            
            // Kiremt (main rains)
            6: "⛈️ *Kiremt Alert:*\nKeep umbrellas and gabi ready!",
            7: "🌧️ *Rainy Season Tip:*\nWaterproof your important documents.",
            8: "💧 *Kiremt Update:*\nWatch for flash floods in low areas.",
            
            // Post-Kiremt
            9: "🌤️ *Season Change:*\nEnjoy the fresh post-rain weather!",
            10: "🍃 *Weather Note:*\nPerfect hiking weather in the highlands!",
            11: "❄️ *Night Alert:*\nCold nights in highland areas - keep warm!"
        };
        return seasonalAdvice[month];
    }
}

module.exports = new InfoService(); 