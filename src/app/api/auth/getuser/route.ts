import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/libs/Useridentifier";
import { Iresponse } from "@/types/response.types";

export async function GET(req: NextRequest) {
  try {
    const userId = await GetUser();
    return NextResponse.json<Iresponse>({
      success: true,
      message: "User fetched successfully",
      body: { userId },
    });
  } catch (error) {
    return NextResponse.json<Iresponse>(
      {
        success: false,
        message: "Unauthorized or token invalid",
      },
      { status: 401 }
    );
  }
}
