module.exports = () => {
    const now = new Date();
    const timeZone = 'CET';
    const buildTime = new Intl.DateTimeFormat('en-EN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone,
    }).format(now);

    return {
        time: {
            raw: now.toISOString(),
            formatted: `${buildTime} ${timeZone}`,
        },
    };
};