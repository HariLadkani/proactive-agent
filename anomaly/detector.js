async function detectAnomalies(data, windowSize = 3, threshold = 2) {
    const anomalies = [];

    for (let i = windowSize; i < data.length; i++) {
        const window = data.slice(i - windowSize, i);
        const mean = window.reduce((s, r) => s + r.sales, 0) / windowSize;

        const std = Math.sqrt(
            window.reduce((s, r) => s + Math.pow(r.sales - mean, 2), 0) 
            / windowSize
        );

        let current = data[i].sales;

        if (Math.abs(current - mean) > threshold * std) {
            anomalies.push({
                row: data[i],
                mean,
                std,
                current,
                deviation: Math.abs(current - mean)
            });
        }
    }

    return anomalies;
}

module.exports = { detectAnomalies };
