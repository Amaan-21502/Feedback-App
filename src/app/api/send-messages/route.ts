import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {Message} from "@/models/User";

export async function POST(request: Request){
    await dbConnect();

    const {username, content} = await request.json()

    try {
        
        const user = await UserModel.findOne({username})
        if(!user){
            return {
                status: 404,
                body: {
                    error: "User not found"
                }
            }
        }

        //is user accepting messages

        if(!user.isAcceptingMessage){
            return {
                status: 400,
                body: {
                    error: "User is not accepting messages"
                }
            }
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return {
            status: 200,
            body: {
                message: newMessage
            }
        }

    } catch (error) {
        console.log("Failed to send message", error)
        return {
            status: 401,
            body: {
                error: "Failed to send message"
            }
        }
        
    }
}