import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    try {
        
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await User.findOne({ username, isVerified: true })

        if (existingUserVerifiedByUsername) {
            return {
                status: 409,
                body: {
                    success: false,
                    message: 'Username already taken.'
                }
            }
        }

        const existingUserByEmail = await User.findOne({ email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail?.isVerified) {
            return {
                status: 409,
                body: {
                    success: false,
                    message: 'Email already taken.'
                }
            }
        }else if(existingUserByEmail && !existingUserByEmail.isVerified){

            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date( new Date().getTime() + 60 * 60 * 1000 )

            await existingUserByEmail.save()

        }else{
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save()
        }

            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            const emailResponse = await sendVerificationEmail({
                username,
                otp,
                email
            })

            if(!emailResponse.success){
                return {
                    status: 500,
                    success: false,
                    body: {
                        success: false,
                        message: 'Error sending verification email.'
                    }
                }
            }

            return {
                status: 201,
                body: {
                    success: true,
                    message: 'User registered successfully. Please check your email for verification code.'
                }
            }
        

    } catch (error) {
        console.error(error)
        return {
            status: 500,
            body: {
                success: false,
                message: 'Error registering user.'
            }
        
    }
}
}
