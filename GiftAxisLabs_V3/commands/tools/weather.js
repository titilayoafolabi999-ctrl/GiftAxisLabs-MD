const axios = require("axios");
module.exports = {
    name: "weather",
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("☁️ *Usage:* .weather [city]\n\n_Example: .weather Lagos_");
        try {
            const city = args.join(" ");
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
            const current = res.data.current_condition[0];
            const area = res.data.nearest_area[0];
            reply(`🌤️ *Weather in ${area.areaName[0].value}*\n\n🌡️ Temp: ${current.temp_C}°C / ${current.temp_F}°F\n💧 Humidity: ${current.humidity}%\n💨 Wind: ${current.windspeedKmph} km/h\n☁️ Condition: ${current.weatherDesc[0].value}\n👁️ Visibility: ${current.visibility} km`);
        } catch (e) {
            reply("❌ Could not fetch weather. Check the city name and try again.");
        }
    }
};
