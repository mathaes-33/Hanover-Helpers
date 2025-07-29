import { GoogleGenAI, Type } from "@google/genai";

// The API key is accessed securely from environment variables on the server.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const jobSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A short, clear title for the job post. Maximum 7 words. Example: "Mow my front and back lawn"' },
    description: { type: Type.STRING, description: 'The original user prompt, used as the detailed description.' },
    category: { type: Type.STRING, enum: ['Lawn Care', 'Handyman', 'Moving Help', 'Errands', 'Babysitting', 'Cleaning', 'Pet Care', 'Snow Removal'], description: 'The single best-fitting job category from the list.' },
    budget: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ['Fixed Rate', 'Hourly'], description: 'The type of budget. If the user mentions a rate per hour, use HOURLY. Otherwise, default to FIXED.' },
        amount: { type: Type.NUMBER, description: 'The numeric value for the budget. Extract it from the text.' }
      },
    },
    date: { type: Type.STRING, description: 'The requested date or time for the job, like "This Saturday" or "Flexible".' },
    isUrgent: { type: Type.BOOLEAN, description: 'Set to true if the user mentions urgency with words like "urgent", "ASAP", or "today".' }
  },
  required: ['title', 'description', 'category', 'date', 'isUrgent']
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ message: "Prompt is required." }) };
    }
    if (prompt.length > 500) {
      return { statusCode: 400, body: JSON.stringify({ message: "Prompt is too long. Please keep it under 500 characters." }) };
    }

    const systemInstruction = `You are an intelligent assistant for the "Hanover Helpers" app. Your task is to parse a user's natural language job request into a structured JSON object. The user is a resident of a small town. Be helpful and interpret their request accurately. The full text of the user's request MUST be the 'description'.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following job request: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            job: jobSchema
          },
          required: ['job']
        },
      },
    });
    
    // The response.text from the SDK is already a JSON string when a schema is provided
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedJson),
    };

  } catch (error) {
    console.error("Error in parse-job function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not understand the job request. Please try rephrasing or post the job manually." }),
    };
  }
};