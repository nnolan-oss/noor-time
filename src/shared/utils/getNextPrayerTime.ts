export const getNextPrayerTime = (times: Record<string, string>) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD

    const parsed = Object.entries(times).map(([key, time]) => {
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date(today);
        date.setHours(hour, minute, 0, 0);
        return { key, time, date };
    });

    const future = parsed.filter(({ date }) => date > now);

    if (future.length === 0) {
        return parsed[0];
    }

    return future[0];
};
