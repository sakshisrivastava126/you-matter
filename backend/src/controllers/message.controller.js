import { group } from 'console';
import Message from '../models/message.js'

export const getMessage = async (req, res) =>{
    try{
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId:  myId}
            ]
        })

        await Message.updateMany({senderId: myId, receiverId: selectedUserId});
        res.json({success: true, messages});
    }
    catch(err){
        console.log(err);
        res.json({success: false, message: err.message})
    }
}

export const sendMessage = async (req, res) => {
    try{
        const {text} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        const community = req.community;

        const newMessage = await Message.create({
            senderId, receiverId, text
        })

        const targetSocketId = connectedUsers[receiverId];
        if(targetSocketId){
            io.to(targetSocketId).emit('personal-message', {
                sender: senderId,
                content : newMessage
            });
        }
        else if(community){
            req.app.io.to(group).emit('community-message', {
                sender: senderId,
                content : newMessage
            });
        }

        res.json({success: true, newMessage});
    }
    catch(err){
        console.log(err);
        res.json({success: false, message: err.message});
    }
}