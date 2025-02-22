import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return {
            status: 401,
            body: {
                error: "Unauthorized"
            }
        }
    }

    const userId = new mongoose.Types.ObjectId(user.id);
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {
                _id: "$_id",
                messages: {$push: "$messages"}
            }}
        ])

        if(!user || !user.length){
            return {
                status: 404,
                body: {
                    error: "User not found"
                }
            }
        }

        return {
            status: 200,
            body: {
                messages: user[0].messages
            }
        }

    } catch (error) {
        
        console.log("Failed to get messages", error)
        return {
            status: 401,
            body: {
                error: "Failed to get messages"
            }
        }
    }
}