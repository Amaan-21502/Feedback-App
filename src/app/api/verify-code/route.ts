import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export default async function POST(request: Request){
    await dbConnect();
    
    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername, verificationCode: code})

        if(!user){
            return Response.json({error: "user not found"}, {status: 400});
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            await UserModel.updateOne({username: decodedUsername}, {isVerified: true});

            return Response.json({message: "user verified"});
        }else if
            (isCodeValid && !isCodeNotExpired){
                return Response.json({error: "code expired"}, {status: 400});
        }else{
            return Response.json({error: "invalid code"}, {status: 400});
        }
    }
        catch (error) {
        console.error("error verifying user", error);
        return Response.json({error: "error verifying user"}, {status: 500});
    }
}
