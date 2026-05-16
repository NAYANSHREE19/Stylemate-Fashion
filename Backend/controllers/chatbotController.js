import { GoogleGenerativeAI } from '@google/generative-ai';
import WardrobeItem from '../models/WardrobeItem.js';
import { normalizeStrictGender } from '../services/genderPromptService.js';

const DEFAULT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';

let genAI = null;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  if (!genAI) genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

/**
 * POST /api/chatbot/chat
 * Body: { message: string, history?: Array<{role, text}> }
 */
export const chatWithStylist = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Fetch user's wardrobe items for context
    let wardrobeContext = 'No wardrobe items available.';
    try {
      const items = await WardrobeItem.find({ user: req.user._id })
        .select('name category color brand season occasion tags')
        .limit(50)
        .lean();

      if (items.length > 0) {
        wardrobeContext = items
          .map((item, i) => {
            const parts = [item.name, item.category, item.color, item.brand]
              .filter(Boolean)
              .join(' | ');
            const seasonStr = item.season?.length ? `Season: ${item.season.join(', ')}` : '';
            const occasionStr = item.occasion?.length ? `Occasion: ${item.occasion.join(', ')}` : '';
            return `${i + 1}. ${parts} ${seasonStr} ${occasionStr}`.trim();
          })
          .join('\n');
      }
    } catch (err) {
      console.warn('Failed to fetch wardrobe for chatbot:', err.message);
    }

    const gender = normalizeStrictGender(req.user?.gender);
    const userName = req.user?.name?.split(' ')[0] || 'there';

    const systemPrompt = `You are StyleMate AI — a warm, knowledgeable personal fashion stylist assistant.
Your personality: friendly, encouraging, fashion-savvy, uses modern lingo but stays professional.

USER PROFILE:
- Name: ${userName}
- Gender: ${gender}

USER'S WARDROBE (items they own):
${wardrobeContext}

RULES:
1. Always try to suggest outfits using items from the user's wardrobe when possible.
2. If the user asks about an outfit for a specific occasion, pick items from their wardrobe that fit.
3. If they don't have suitable items, suggest what they should buy and why.
4. Keep responses concise but helpful (2-4 paragraphs max).
5. Use fashion terminology naturally.
6. Add a touch of personality — emojis are okay but don't overdo it.
7. If they ask something non-fashion related, gently steer back to style.
8. When suggesting wardrobe items, reference them by their actual name/color from the wardrobe list.`;

    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: DEFAULT_MODEL });

    // Build conversation history for multi-turn
    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: `Hey ${userName}! I'm your StyleMate AI stylist. I've got your wardrobe loaded up and I'm ready to help you look amazing. What can I help you with today?` }] },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      reply: text
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get response from AI stylist'
    });
  }
};
