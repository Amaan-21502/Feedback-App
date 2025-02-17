import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpScheme";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
    });

    export async function GET(request: Request) {
        // legacy code
        // if(request.method !== "GET"){
        //     return {
        //         status: 405,
        //         body: {
        //             message: "Method Not Allowed",
        //         },
        //     };
        // }

        await dbConnect();

        try {
            const {searchParams} = new URL(request.url);
            const queryParam = {
                username: searchParams.get("username"),

            }
            // validate with zod
            const result = UsernameQuerySchema.safeParse(queryParam);

            if(!result.success){
                const usernameErrors = result.error.format().username?._errors || [];
                return Response.json({
                    status: 400,
                    body: {
                        message: "Bad Request",
                        errors: usernameErrors,
                    },
                })
            }

            const {username} = result.data;

            const existingVerifiedUser = await UserModel.findOne({username: username, isVerified: true});

            if(existingVerifiedUser){
                return {
                    status: 200,
                    body: {
                        message: "Username is already taken",
                    },
                };
            }

            return {
                status: 200,
                body: {
                    message: "Username is available",
                },
            };

        } catch (error) {
            console.error(error);
            return {
                status: 500,
                body: {
                    message: "Internal Server Error",
                },
            };
            
        }
    }