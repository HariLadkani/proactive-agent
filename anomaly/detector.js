async function detectAnomalies(data, windowSize = 3, threshold = 2, startIndex = 0) {
    const anomalies = [];

    // Ensure we start at least at windowSize
    const iStart = Math.max(windowSize, startIndex);

    for (let i = iStart; i < data.length; i++) {
        const window = data.slice(i - windowSize, i);

        const mean = window.reduce((sum, row) => sum + row.sales, 0) / windowSize;
        const std = Math.sqrt(
            window.reduce((sum, row) => sum + Math.pow(row.sales - mean, 2), 0) / windowSize
        );

        const current = data[i].sales;

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
