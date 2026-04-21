import mongoose from 'mongoose';
const {Schema, model} = mongoose;

//add name
const userSchema = new Schema({
    userName : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase: true,
        unique : true, 
    },
    password : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required: true
    },
    role : { //create enum
        type : String,
        enum : ['user', 'specialist', 'consulte', 'User', 'Specialist', 'Consulte'],
        default : 'user',
        required : true
    }
}, {timestamps : true});

const User = model('User', userSchema);
export default User;