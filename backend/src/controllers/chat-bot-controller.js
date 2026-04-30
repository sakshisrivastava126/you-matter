import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

export const chatBot = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: true, message: "No prompt provided" });
        }

        const groq = new Groq({ 
            apiKey: process.env.GROQ_API_KEY 
        });

        const ans = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a psychiatrist with 10+ years of expeirence. You have to talk with clients very politely and give them meaningful replies to make thier mental health better. Keep the answers short and answer in such a way that you are a chat bot."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "openai/gpt-oss-20b", 
        });

        return res.json({
            success: true,
            message: ans.choices[0].message.content 
        });
    } 
    catch (err) {
        console.error("Groq Controller Error:", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


