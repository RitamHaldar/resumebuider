import { JwtPayload } from "@/types/user.types";
import jwt from "jsonwebtoken";


export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1hr"
    })
}

export const verifytoken = (token:string):any=>{
    return jwt.verify(token,process.env.JWT_SECRET!)
}