class ImageService {
    getMorningImages() {
        return [
            // Ethiopian Sunrise & Morning Scenes
            'https://images.unsplash.com/photo-1600182610361-4b4d664e07b5',
            'https://images.unsplash.com/photo-1589825743636-e6cc0471feb9',
            // Lalibela Morning
            'https://images.unsplash.com/photo-1623165540483-3d83c2d2dc5e',
            // Ethiopian Highlands Morning
            'https://images.unsplash.com/photo-1565299507177-b0ac66763828',
            // Addis Ababa Morning
            'https://images.unsplash.com/photo-1580675777771-5f8b4a3b0551',
            // Simien Mountains Sunrise
            'https://images.unsplash.com/photo-1574706335768-1aa2b0e5c3a3'
        ];
    }

    getCoffeeImages() {
        return [
            // Traditional Coffee Ceremony
            'https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba',
            'https://images.unsplash.com/photo-1589825742316-c23c5d8b6b66',
            // Coffee Beans & Processing
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
            // Modern Ethiopian Cafe
            'https://images.unsplash.com/photo-1568649929103-28ffbefaca1e',
            // Coffee Farm
            'https://images.unsplash.com/photo-1599744615988-c9f52f218eb0',
            // Coffee Roasting
            'https://images.unsplash.com/photo-1587664379428-1f01b5534652'
        ];
    }

    getSafetyImages() {
        return [
            // Emergency Preparedness
            'https://images.unsplash.com/photo-1582738411706-3fc29f5f7384',
            // First Aid Kit
            'https://images.unsplash.com/photo-1584483766114-2cea6facdf57',
            // Safety Signs
            'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd',
            // Emergency Contact
            'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
            // Community Safety
            'https://images.unsplash.com/photo-1590504435622-81b3dc05d1f9',
            // Emergency Services
            'https://images.unsplash.com/photo-1577127305776-7211b2b2a3b3'
        ];
    }

    getTeaTimeImages() {
        return [
            // Ethiopian Tea Ceremony
            'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03',
            // Traditional Tea Setting
            'https://images.unsplash.com/photo-1545579133-99bb5ab189bd',
            // Modern Tea Shop
            'https://images.unsplash.com/photo-1562547256-2c5ee93b60b7',
            // Tea Preparation
            'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2',
            // Tea Leaves
            'https://images.unsplash.com/photo-1582591068230-cbf627c2b179',
            // Tea Garden
            'https://images.unsplash.com/photo-1587744479374-4e40ebb47889'
        ];
    }

    getSunsetImages() {
        return [
            // Ethiopian Sunset
            'https://images.unsplash.com/photo-1575503802870-45de6a6217c8',
            // Rift Valley Sunset
            'https://images.unsplash.com/photo-1586791965591-15d8892f6dd6',
            // Mountain Sunset
            'https://images.unsplash.com/photo-1572367702552-028c68da9b57',
            // City Sunset
            'https://images.unsplash.com/photo-1569530593440-e48dc137f7d0',
            // Desert Sunset
            'https://images.unsplash.com/photo-1588627541420-fce3f661b779',
            // Lake Tana Sunset
            'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e'
        ];
    }

    getNightImages() {
        return [
            // Starry Night
            'https://images.unsplash.com/photo-1572367702552-028c68da9b57',
            // City Night
            'https://images.unsplash.com/photo-1589656966895-2f33e7653819',
            // Night Market
            'https://images.unsplash.com/photo-1590418606746-018840f9cd0f',
            // Traditional Night
            'https://images.unsplash.com/photo-1564577160324-112d603f750f',
            // Night Festival
            'https://images.unsplash.com/photo-1578595335060-e5f6c19a3c8e',
            // Monastery at Night
            'https://images.unsplash.com/photo-1573919664886-d9d7829d7c9e'
        ];
    }

    getSeasonalImages(month) {
        const seasonalImages = {
            // Bega (dry season)
            0: ['https://images.unsplash.com/photo-1578595335060-e5f6c19a3c8e'], // January
            1: ['https://images.unsplash.com/photo-1573919664886-d9d7829d7c9e'], // February
            2: ['https://images.unsplash.com/photo-1588627541420-fce3f661b779'], // March
            
            // Belg (short rains)
            3: ['https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e'], // April
            4: ['https://images.unsplash.com/photo-1587744479374-4e40ebb47889'], // May
            5: ['https://images.unsplash.com/photo-1582591068230-cbf627c2b179'], // June
            
            // Kiremt (main rains)
            6: ['https://images.unsplash.com/photo-1590504435622-81b3dc05d1f9'], // July
            7: ['https://images.unsplash.com/photo-1577127305776-7211b2b2a3b3'], // August
            8: ['https://images.unsplash.com/photo-1587664379428-1f01b5534652'], // September
            
            // Post-Kiremt
            9: ['https://images.unsplash.com/photo-1599744615988-c9f52f218eb0'],  // October
            10: ['https://images.unsplash.com/photo-1574706335768-1aa2b0e5c3a3'], // November
            11: ['https://images.unsplash.com/photo-1580675777771-5f8b4a3b0551']  // December
        };
        return seasonalImages[month] || this.getMorningImages();
    }

    getRandomImage(collection) {
        const images = this[collection]();
        return images[Math.floor(Math.random() * images.length)];
    }

    getTimeBasedImage(hour) {
        const currentMonth = new Date().getMonth();
        // 20% chance to show a seasonal image instead of time-based
        if (Math.random() < 0.2) {
            const seasonalImages = this.getSeasonalImages(currentMonth);
            return seasonalImages[Math.floor(Math.random() * seasonalImages.length)];
        }

        switch(hour) {
            case 6:
                return this.getRandomImage('getMorningImages');
            case 9:
                return this.getRandomImage('getCoffeeImages');
            case 11:
            case 14:
                return this.getRandomImage('getSafetyImages');
            case 16:
                return this.getRandomImage('getTeaTimeImages');
            case 19:
                return this.getRandomImage('getSunsetImages');
            case 21:
                return this.getRandomImage('getNightImages');
            default:
                return this.getRandomImage('getMorningImages');
        }
    }
}

module.exports = new ImageService(); 