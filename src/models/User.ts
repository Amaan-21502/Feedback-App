import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({content: {
    type: String,
    required: true
},
createdAt: {
    type: Date,
    required: true,
    default: Date.now
}
});

export interface User extends Document{
    usernane: string;
    email: string;  
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages : Message[];
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    verifyCode: {
        type: String,
        required: [true, "Please provide a verification code"],
    },
    verifyCodeExpiry: {
        required: [true, "Please provide a verification code expiry date"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages : [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema); // specifying model with typescript

export default UserModel;