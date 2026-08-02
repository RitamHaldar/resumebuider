import { connecttoDb } from "@/libs/database";
import { generateToken } from "@/libs/jwtsecret";
import { userModel } from "@/models/UserModel";
import { Iresponse } from "@/types/response.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connecttoDb()
        const body: LoginBody = await req.json();
        const { email, password } = body
        if (!email || !password) return NextResponse.json<Iresponse>({
            success: false, message: "Insufficient data"
        })
        const userExists = await userModel.findOne({
            email: email
        })
        if (!userExists) return NextResponse.json<Iresponse>({
            success: false, message: "user not found"
        }, { status: 404 })

        const confirmPass = userExists.comparepass(password)
        if (!confirmPass) return NextResponse.json<Iresponse>({
            success: false, message: "Invalid Password"
        }, { status: 401 })

        const cookie = generateToken({ userId: userExists._id.toString() })

        const response = NextResponse.json<Iresponse>({
            success: true, message: "User Logged In successfully"
        })

        response.cookies.set("token", cookie)

        return response
    }
    catch (e) {
        return NextResponse.json<Iresponse>({
            success: false, message: "Failed to Login", error: { e }
        }, { status: 400 })
    }


}