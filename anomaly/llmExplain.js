require("dotenv").config();


const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function explainAnomaly() {
    const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: "Explain the importance of fast language models",
    });
    console.log(response.output_text);
    return response;
}

explainAnomaly();




