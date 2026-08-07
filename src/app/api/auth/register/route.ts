import { connecttoDb } from "@/libs/database";
import { generateToken } from "@/libs/jwtsecret";
import { userModel } from "@/models/UserModel";
import { Iresponse } from "@/types/response.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        await connecttoDb()

        const body: RegisterBody = await req.json()

        let { name, email, mobile, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json<Iresponse>({
                success: false, message: "All fields are required",
            }, {
                status: 400
            })
        };

        let isExisted = await userModel.findOne({ email })

        if (isExisted) return NextResponse.json<Iresponse>({
            success: false, message: "User already exists",
        }, {
            status: 409
        })

        let newUser = await userModel.create({
            name, email, password, mobile
        })

        let token = generateToken({ userId: newUser._id.toString() })

        let response = NextResponse.json<Iresponse>({
            success: true, message: "User registered successfully", body: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            }
        }, { status: 201 })

        response.cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        })

        return response

    } catch (error) {
        console.log("error in register api", error)
        return NextResponse.json<Iresponse>({
            success: false, message: "Something went wrong", error: {
                error
            }
        }, { status: 500 })
    }

}