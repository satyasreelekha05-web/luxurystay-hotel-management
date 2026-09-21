import { GoogleGenerativeAI } from '@google/generative-ai';
import Room from '../models/Room.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ─── 1. AI Hotel Assistant Chatbot ───────────────────────────────────────────
export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const prompt = `You are a helpful hotel assistant for LuxuryStay Hotel. 
Answer only hotel-related questions about: room types, booking process, check-in (2:00 PM) / check-out (11:00 AM) timings, amenities (WiFi, pool, gym, spa, restaurant), cancellation policy (free cancellation 24hrs before check-in), and general hotel facilities.
If the question is not hotel-related, politely say you can only help with hotel queries.
Keep answers short, friendly, and helpful (2-4 sentences max).

Guest question: ${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// ─── 2. AI Room Recommendation ───────────────────────────────────────────────
export const getAIRecommendations = async (req, res) => {
  try {
    const { budget, guests, preferences } = req.body;
    if (!budget || !guests) return res.status(400).json({ message: 'Budget and guests are required' });

    const rooms = await Room.find({ isAvailable: true, price: { $lte: Number(budget) }, capacity: { $gte: Number(guests) } });

    if (rooms.length === 0) return res.json({ recommendations: [], message: 'No rooms match your criteria.' });

    const roomList = rooms.map(r =>
      `ID:${r._id} | ${r.name} | ${r.category} | ₹${r.price}/night | ${r.capacity} guests | Amenities: ${r.amenities.join(', ')}`
    ).join('\n');

    const prompt = `You are a hotel room recommendation expert for LuxuryStay Hotel.
A guest is looking for a room with:
- Budget: ₹${budget} per night
- Guests: ${guests}
- Preferences: ${preferences || 'no specific preferences'}

Available rooms:
${roomList}

Recommend the TOP 3 most suitable rooms. For each room, provide a 1-2 sentence personalized explanation of why it suits the guest.
Respond in this exact JSON format (no markdown, no extra text):
[
  { "roomId": "...", "reason": "..." },
  { "roomId": "...", "reason": "..." },
  { "roomId": "...", "reason": "..." }
]
If fewer than 3 rooms are available, recommend only those available.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown code blocks if present
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    const parsed = JSON.parse(text);

    const recommendations = parsed.map(item => {
      const room = rooms.find(r => r._id.toString() === item.roomId);
      return room ? { room, reason: item.reason } : null;
    }).filter(Boolean);

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// ─── 3. AI Review Summary ────────────────────────────────────────────────────
export const getReviewSummary = async (req, res) => {
  try {
    const { reviews } = req.body;
    if (!reviews || reviews.length === 0) return res.status(400).json({ message: 'Reviews are required' });

    const reviewText = reviews.map((r, i) => `Review ${i + 1}: "${r}"`).join('\n');

    const prompt = `Analyze these hotel room reviews and provide a brief summary.
${reviewText}

Respond in this exact JSON format (no markdown, no extra text):
{
  "positive": "1-2 sentences summarizing common praise",
  "negative": "1-2 sentences summarizing common complaints (or 'No significant complaints found.' if mostly positive)",
  "overall": "One sentence overall verdict"
}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    const summary = JSON.parse(text);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};
