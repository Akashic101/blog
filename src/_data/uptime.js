require('dotenv').config();

module.exports = async () => {
    const url = 'http://192.168.0.113:8000/uptime';
    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    };

    try {
        // Use dynamic import for 'node-fetch'
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(url, { method: 'GET', headers: headers });
        const data = await response.json();

        console.log(data);

        const dayUptime = calculateTotalUptime(data, 24);  // 24 hours for a day
        const monthUptime = calculateTotalUptime(data, 720);  // 720 hours for a month

        return {
            uptime: {
                day: {
                    raw: dayUptime,
                    formatted: (dayUptime * 100).toFixed(2)
                },
                month: {
                    raw: monthUptime,
                    formatted: (monthUptime * 100).toFixed(2)
                }
            }
        };
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Call the function to execute it
module.exports();
