require('dotenv').config();

module.exports = async () => {
    const authUrl = 'http://192.168.0.113:8000/login/access-token';
    const apiUrl = 'http://192.168.0.113:8000/uptime';
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const credentials = {
        grant_type: '',
        username: process.env.UPTIME_KUMA_WEB_API_USERNAME,
        password: process.env.UPTIME_KUMA_WEB_API_PASSWORD,
        scope: '',
        client_id: '',
        client_secret: '',
    };

    try {
        const fetch = (await import('node-fetch')).default;

        // Get access token
        const authResponse = await fetch(authUrl, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams(credentials),
        });

        if (authResponse.status === 200) {
            const authData = await authResponse.json();
            const accessToken = authData.access_token;

            // Use access token in subsequent requests
            const apiHeaders = {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            };

            const apiResponse = await fetch(apiUrl, { method: 'GET', headers: apiHeaders });

            if (apiResponse.status === 200) {
                const data = await apiResponse.json();

                const dayUptime = calculateTotalUptime(data, 24);
                const monthUptime = calculateTotalUptime(data, 720);

                return {
                    day: {
                        raw: dayUptime,
                        formatted: (dayUptime * 100).toFixed(2),
                    },
                    month: {
                        raw: monthUptime,
                        formatted: (monthUptime * 100).toFixed(4),
                    },
                };
            } else {
                console.error('Error:', `Received unexpected status code: ${apiResponse.status}`);
            }
        } else {
            console.error('Error:', `Received unexpected status code: ${authResponse.status}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

function calculateTotalUptime(data, durationThreshold) {
    const filteredData = data.filter(record => record.duration === durationThreshold);
    const totalUptime = filteredData.reduce((sum, record) => sum + record.uptime, 0);
    return totalUptime;
}


// Call the function to execute it
module.exports();
