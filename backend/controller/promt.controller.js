import OpenAI from "openai";
import { Promt } from "../model/promt.model.js";

console.log("🧪 API KEY CHECK:", process.env.OPENROUTER_API_KEY);

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});
export const sendPromt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Promt content is required" });
  }
  console.log("userId in sendPromt:", userId);

  try {
    // save user promt
    const userPromt = await Promt.create({
      userId,
      role: "user",
      content,
    });

    // send to openAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: content }],
      model: "deepseek/deepseek-chat",
    });
    const aiContent = completion.choices[0].message.content;

    // save assistant promt
    const aiMessage = await Promt.create({
      userId,
      role: "assistant",
      content: aiContent,
    });
    return res.status(200).json({ reply: aiContent });
  } catch (error) {
    console.log("Error in Promt: ", error);
    return res
      .status(500)
      .json({ error: "Something went wrong with the AI response" });
  }
};
