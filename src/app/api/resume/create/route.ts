import { NextRequest, NextResponse } from "next/server";
import { ResumeModel } from "@/models/ResumeModel";
import { connecttoDb } from "@/libs/database";
import { GetUser } from "@/libs/Useridentifier";
import { Iresponse } from "@/types/response.types";
export async function POST(req: NextRequest) {
  try {
    await connecttoDb();
    const userid = await GetUser();
    const body=await req.json();
    
    const resume = await ResumeModel.create({userid:userid});
    return NextResponse.json<Iresponse>({ success: true, message:"Resume created successfully", body:resume });
  } catch (error) {
    return NextResponse.json<Iresponse>({ success: false, message:"Failed to create resume", error:{error} });
  }
}
