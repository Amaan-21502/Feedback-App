import 'next-auth'
import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface user{
            id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        }
        interface Session{
            user: {
                _id?: string;
                isVerified?: boolean;
                isAcceptingMessages?: boolean;
                username?: string;
        } & DefaultSession['user']
        }
}

declare module 'next-auth/jwt'{ //another way to write
    interface JWT{
        id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}