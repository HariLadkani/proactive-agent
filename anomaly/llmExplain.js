require("dotenv").config();


const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function explainAnomaly(inputText) {
    const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: inputText,
    });
    return response;
}


async function buildPrompt(a, metric_name) {
    return `
You are an analytics and observability expert.  
Explain the following detected anomaly in simple, concise terms a business stakeholder can understand.

Here are the anomaly details:
- Metric name: ${metric_name}
- Timestamp: ${a.row.timestamp}
- Metric value: ${a.current}
- Rolling mean (window): ${a.mean}
- Standard deviation: ${a.std}
- Deviation from normal: ${a.deviation}

Only answer with:
1. A simple explanation of what happened
2. The most likely causes
3. The potential business impact

Avoid technical jargon. Be clear, concise, and insightful.
`;
}

module.exports = {
    explainAnomaly, buildPrompt
};




