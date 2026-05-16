import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const run = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are a stylist' }] },
        { role: 'model', parts: [{ text: 'Hello' }] }
      ]
    });
    const result = await chat.sendMessage("What should I wear?");
    console.log(result.response.text());
  } catch (e) {
    console.error(e);
  }
};
run();
