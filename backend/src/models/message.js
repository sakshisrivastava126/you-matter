import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const chatSchema = new Schema({
    receiverId : {
        type : String,
        required: true
    },
    senderId : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
}, { timestamps : true })  

const Message = model('Message', chatSchema);

export default Message;
