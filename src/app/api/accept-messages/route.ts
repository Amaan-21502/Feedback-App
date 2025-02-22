import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request){
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

    const userId = user.id;
    const {acceptMessages} = await request.json()

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )
        if(!updatedUser){
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
                message: "User status updated successfully",
                user: updatedUser
            }
        }


    } catch (error) {
        console.log("Failed to update user status", error)
        return {
            status: 401,
            body: {
                error: "Failed to update user status"
            }
        }
    }
}

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

    const userId = user.id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
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
                user: foundUser
            }
        }
    
    } catch (error) {
        console.log("Failed to get user status", error)
        return {
            status: 401,
            body: {
                error: "Failed to get user status"
            }
        }
        
    }
}