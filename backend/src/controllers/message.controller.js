import Message from '../models/message.js'

/** GET /message/dm/:receiverId  — fetch conversation history */
export const getDmMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const myId = String(req.user._id);

        const messages = await Message.find({
            $or: [
                { senderId: myId,       receiverId: receiverId },
                { senderId: receiverId, receiverId: myId       },
            ]
        }).sort({ createdAt: 1 });

        res.json({ success: true, messages });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

/** POST /message/dm/:receiverId  — persist a DM and return it */
export const sendDmMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const receiverId = req.params.receiverId;
        const senderId = String(req.user._id);

        if (!text?.trim()) {
            return res.json({ success: false, message: 'Message cannot be empty' });
        }

        const newMessage = await Message.create({ senderId, receiverId, message: text.trim() });
        res.json({ success: true, newMessage });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

// Keep old exports so existing imports don't break
export const getMessage = getDmMessages;
export const sendMessage = sendDmMessage;