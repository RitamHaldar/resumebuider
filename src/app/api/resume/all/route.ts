import { NextRequest, NextResponse } from "next/server";
import { ResumeModel } from "@/models/ResumeModel";
import { connecttoDb } from "@/libs/database";
import { GetUser } from "@/libs/Useridentifier";
import { Iresponse } from "@/types/response.types";
export async function GET(req: NextRequest) {
  try {
    await connecttoDb();
    const userid = await GetUser();
    const resumes = await ResumeModel.find({ userid });
    return NextResponse.json<Iresponse>({ success: true, message: "Resumes fetched successfully", body: resumes });
  } catch (error) {
    return NextResponse.json<Iresponse>({ success: false, message: "Failed to fetch resumes", error: { error } });
  }
}